import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db";
import { companies, interviewSessions, interviews, processes } from "@/lib/db/schema";
import { interviewDraftSchema, questionnaireSchemaVersion } from "@/lib/interview-schema";
import { getCurrentInterviewSession, hashInterviewSessionToken, interviewSessionCookieName } from "@/lib/interview-session";

export const runtime = "nodejs";

const sessionLifetimeSeconds = 60 * 60 * 24 * 30;
const sessionLifetimeMilliseconds = sessionLifetimeSeconds * 1000;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  try {
    const session = await getCurrentInterviewSession();
    if (!session) return json({ interview: null });

    const [interview] = await getDatabase()
      .select({
        answers: interviews.answers,
        currentStep: interviews.currentStep,
        currentScreen: interviews.currentScreen,
        schemaVersion: interviews.schemaVersion,
      })
      .from(interviews)
      .where(eq(interviews.id, session.interviewId))
      .limit(1);

    return json({ interview: interview ?? null });
  } catch {
    return json({ error: "storage_unavailable" }, 503);
  }
}

export async function POST() {
  try {
    const database = getDatabase();
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + sessionLifetimeMilliseconds);

    await database.transaction(async (transaction) => {
      const [company] = await transaction.insert(companies).values({}).returning({ id: companies.id });
      const [interview] = await transaction.insert(interviews).values({
        companyId: company.id,
        schemaVersion: questionnaireSchemaVersion,
      }).returning({ id: interviews.id });

      await transaction.insert(processes).values({ interviewId: interview.id });
      await transaction.insert(interviewSessions).values({
        interviewId: interview.id,
        tokenHash: hashInterviewSessionToken(token),
        expiresAt,
      });
    });

    (await cookies()).set(interviewSessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: sessionLifetimeSeconds,
    });

    return json({ created: true }, 201);
  } catch {
    return json({ error: "storage_unavailable" }, 503);
  }
}

export async function PUT(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 64_000) return json({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = interviewDraftSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_draft" }, 422);

  try {
    const session = await getCurrentInterviewSession();
    if (!session) return json({ error: "interview_not_found" }, 404);

    const cookieStore = await cookies();
    const token = cookieStore.get(interviewSessionCookieName)?.value;
    if (!token) return json({ error: "interview_not_found" }, 404);

    const [interview] = await getDatabase()
      .select({ companyId: interviews.companyId })
      .from(interviews)
      .where(eq(interviews.id, session.interviewId))
      .limit(1);
    if (!interview) return json({ error: "interview_not_found" }, 404);

    const { answers, currentStep, currentScreen } = parsed.data;
    const now = new Date();
    const status = currentScreen === "done"
      ? "confirmed"
      : currentScreen === "review"
        ? "pending_review"
        : currentScreen === "questions"
          ? "in_progress"
          : "draft";

    await getDatabase().transaction(async (transaction) => {
      await transaction.update(interviews).set({
        answers,
        currentStep,
        currentScreen,
        status,
        schemaVersion: questionnaireSchemaVersion,
        updatedAt: now,
      }).where(eq(interviews.id, session.interviewId));

      await transaction.update(companies).set({
        name: answers.companyName || null,
        sector: answers.sector || null,
        location: answers.location || null,
        updatedAt: now,
      }).where(eq(companies.id, interview.companyId));

      await transaction.update(processes).set({
        name: answers.processName || null,
        goal: answers.processGoal || null,
        frequency: answers.frequency || null,
        caseCount: answers.cases || null,
        minutesPerCase: answers.minutes || null,
        tools: answers.tools || null,
        manualStep: answers.manualStep || null,
        problems: answers.problems || null,
        humanDecisions: answers.humanDecisions || null,
        updatedAt: now,
      }).where(eq(processes.interviewId, session.interviewId));

      await transaction.update(interviewSessions).set({
        expiresAt: new Date(Date.now() + sessionLifetimeMilliseconds),
      }).where(eq(interviewSessions.interviewId, session.interviewId));
    });

    cookieStore.set(interviewSessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: sessionLifetimeSeconds,
    });

    return json({ saved: true });
  } catch {
    return json({ error: "storage_unavailable" }, 503);
  }
}