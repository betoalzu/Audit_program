import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { interviewAnalyses, interviews } from "@/lib/db/schema";
import { analyzeInterviewAnswers, InterviewAnalysisConfigurationError, InterviewAnalysisEvidenceError } from "@/lib/ai/analyze-interview";
import { followUpResponseSchema, hashInterviewAnswers, interviewAnalysisSchema } from "@/lib/ai/interview-analysis";
import { interviewAnswersSchema } from "@/lib/interview-schema";
import { getCurrentInterviewSession } from "@/lib/interview-session";

export const runtime = "nodejs";

const promptVersion = 1;
const maxAnalysisRuns = 2;

type Reservation =
  | { kind: "cached"; result: NonNullable<typeof interviewAnalyses.$inferSelect.result> }
  | { kind: "running" }
  | { kind: "limit" }
  | { kind: "not_found" }
  | { kind: "invalid_answers" }
  | { kind: "reserved"; answers: ReturnType<typeof interviewAnswersSchema.parse>; answerHash: string };

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST() {
  const session = await getCurrentInterviewSession().catch(() => null);
  if (!session) return json({ error: "interview_not_found" }, 404);

  const database = getDatabase();
  const reservation = await database.transaction<Reservation>(async (transaction) => {
    const [interview] = await transaction
      .select({ answers: interviews.answers })
      .from(interviews)
      .where(eq(interviews.id, session.interviewId))
      .limit(1)
      .for("update");

    if (!interview) return { kind: "not_found" };
    const parsedAnswers = interviewAnswersSchema.safeParse(interview.answers);
    if (!parsedAnswers.success) return { kind: "invalid_answers" };

    const answers = parsedAnswers.data;
    const answerHash = hashInterviewAnswers(answers);
    const [existing] = await transaction
      .select()
      .from(interviewAnalyses)
      .where(eq(interviewAnalyses.interviewId, session.interviewId))
      .limit(1);

    if (existing?.answerHash === answerHash && existing.status === "completed" && existing.result) {
      return { kind: "cached", result: existing.result };
    }
    if (existing?.status === "running") return { kind: "running" };
    if (existing && existing.runCount >= maxAnalysisRuns) return { kind: "limit" };

    if (existing) {
      await transaction.update(interviewAnalyses).set({
        answerHash,
        status: "running",
        runCount: sql`${interviewAnalyses.runCount} + 1`,
        model: "gemini-3.1-flash-lite",
        promptVersion,
        result: null,
        inputTokens: null,
        outputTokens: null,
        updatedAt: new Date(),
      }).where(eq(interviewAnalyses.id, existing.id));
    } else {
      await transaction.insert(interviewAnalyses).values({
        interviewId: session.interviewId,
        answerHash,
        model: "gemini-3.1-flash-lite",
        promptVersion,
      });
    }

    return { kind: "reserved", answers, answerHash };
  });

  if (reservation.kind === "not_found") return json({ error: "interview_not_found" }, 404);
  if (reservation.kind === "invalid_answers") return json({ error: "invalid_interview_answers" }, 422);
  if (reservation.kind === "running") return json({ error: "analysis_in_progress" }, 409);
  if (reservation.kind === "limit") return json({ error: "analysis_limit_reached" }, 429);
  if (reservation.kind === "cached") return json({ analysis: reservation.result, cached: true });

  try {
    const generated = await analyzeInterviewAnswers(reservation.answers);
    const [currentInterview] = await database
      .select({ answers: interviews.answers })
      .from(interviews)
      .where(eq(interviews.id, session.interviewId))
      .limit(1);

    if (!currentInterview || hashInterviewAnswers(currentInterview.answers) !== reservation.answerHash) {
      await database.update(interviewAnalyses).set({
        status: "failed",
        updatedAt: new Date(),
      }).where(and(
        eq(interviewAnalyses.interviewId, session.interviewId),
        eq(interviewAnalyses.answerHash, reservation.answerHash),
      ));
      return json({ error: "interview_changed_during_analysis" }, 409);
    }

    await database.update(interviewAnalyses).set({
      status: "completed",
      result: generated.analysis,
      model: generated.model,
      promptVersion,
      inputTokens: generated.inputTokens,
      outputTokens: generated.outputTokens,
      updatedAt: new Date(),
    }).where(and(
      eq(interviewAnalyses.interviewId, session.interviewId),
      eq(interviewAnalyses.answerHash, reservation.answerHash),
      eq(interviewAnalyses.status, "running"),
    ));

    return json({ analysis: generated.analysis, cached: false });
  } catch (error) {
    await database.update(interviewAnalyses).set({
      status: "failed",
      updatedAt: new Date(),
    }).where(and(
      eq(interviewAnalyses.interviewId, session.interviewId),
      eq(interviewAnalyses.answerHash, reservation.answerHash),
      eq(interviewAnalyses.status, "running"),
    ));

    if (error instanceof InterviewAnalysisConfigurationError) {
      return json({ error: "ai_not_configured" }, 503);
    }
    if (error instanceof InterviewAnalysisEvidenceError) {
      return json({ error: "invalid_ai_analysis" }, 502);
    }
    return json({ error: "ai_service_unavailable" }, 502);
  }
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const response = followUpResponseSchema.safeParse(body);
  if (!response.success) return json({ error: "invalid_follow_up_response" }, 422);

  try {
    const session = await getCurrentInterviewSession();
    if (!session) return json({ error: "interview_not_found" }, 404);

    const database = getDatabase();
    const [analysis] = await database
      .select({ result: interviewAnalyses.result, followUpResponses: interviewAnalyses.followUpResponses })
      .from(interviewAnalyses)
      .where(and(
        eq(interviewAnalyses.interviewId, session.interviewId),
        eq(interviewAnalyses.status, "completed"),
      ))
      .limit(1);

    const parsedAnalysis = analysis?.result && interviewAnalysisSchema.safeParse(analysis.result);
    const issue = parsedAnalysis?.success ? parsedAnalysis.data.issues[response.data.issueIndex] : null;
    if (!issue?.followUpQuestion) return json({ error: "follow_up_not_found" }, 404);

    const followUpResponses = [
      ...(analysis.followUpResponses ?? []).filter((item) => item.issueIndex !== response.data.issueIndex),
      response.data,
    ];
    await database.update(interviewAnalyses).set({
      followUpResponses,
      updatedAt: new Date(),
    }).where(eq(interviewAnalyses.interviewId, session.interviewId));

    return json({ followUpResponses });
  } catch {
    return json({ error: "storage_unavailable" }, 503);
  }
}