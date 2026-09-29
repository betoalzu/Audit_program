import { createHash } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db";
import { interviewSessions } from "@/lib/db/schema";

export const interviewSessionCookieName = "atlas_interview";

export function hashInterviewSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getCurrentInterviewSession() {
  const token = (await cookies()).get(interviewSessionCookieName)?.value;
  if (!token) return null;

  const [session] = await getDatabase()
    .select({ interviewId: interviewSessions.interviewId })
    .from(interviewSessions)
    .where(and(
      eq(interviewSessions.tokenHash, hashInterviewSessionToken(token)),
      gt(interviewSessions.expiresAt, new Date()),
    ))
    .limit(1);

  return session ?? null;
}