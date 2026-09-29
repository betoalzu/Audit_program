import { describe, expect, it } from "vitest";
import { interviewAnswersSchema, interviewDraftSchema, reviewInterviewAnswers } from "./interview-schema";

describe("interview answer validation", () => {
  it("accepts incomplete drafts and special answers", () => {
    expect(interviewDraftSchema.safeParse({
      answers: { cases: "No lo sé" },
      currentStep: 2,
      currentScreen: "questions",
    }).success).toBe(true);
  });

  it("rejects negative or non-numeric counts", () => {
    expect(interviewAnswersSchema.safeParse({ cases: "-1" }).success).toBe(false);
    expect(interviewAnswersSchema.safeParse({ minutes: "Infinity" }).success).toBe(false);
  });

  it("rejects unknown answer fields and invalid frequencies", () => {
    expect(interviewAnswersSchema.safeParse({ unexpected: "value" }).success).toBe(false);
    expect(interviewAnswersSchema.safeParse({ frequency: "Cada año" }).success).toBe(false);
  });

  it("reports required information that is missing", () => {
    expect(reviewInterviewAnswers({}).missing).toContain("companyName");
    expect(reviewInterviewAnswers({}).missing).toContain("frequency");
  });

  it("flags a case count whose period is unknown without blocking draft storage", () => {
    const answers = { cases: "30", frequency: "No lo sé" } as const;

    expect(reviewInterviewAnswers(answers).inconsistencies).toEqual(["case_count_without_frequency"]);
    expect(interviewAnswersSchema.safeParse(answers).success).toBe(true);
  });
});