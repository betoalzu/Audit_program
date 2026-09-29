import { z } from "zod";

export const questionnaireSchemaVersion = 1;

export const specialAnswers = ["No lo sé", "No aplica", "Prefiero no responder"] as const;

const textAnswer = z.string().max(4000);
const numericAnswer = textAnswer.refine((value) => {
  const normalized = value.trim();
  return normalized === "" || specialAnswers.includes(normalized as typeof specialAnswers[number]) ||
    (Number.isFinite(Number(normalized)) && Number(normalized) >= 0);
}, "Debe ser un número válido igual o mayor que cero.");

export const interviewAnswersSchema = z.object({
  companyName: textAnswer,
  sector: textAnswer,
  location: textAnswer,
  processName: textAnswer,
  processGoal: textAnswer,
  frequency: z.enum([
    "Varias veces al día",
    "Cada día",
    "Cada semana",
    "Cada mes",
    "No lo sé",
    "No aplica",
    "Prefiero no responder",
    "",
  ]),
  cases: numericAnswer,
  minutes: numericAnswer,
  tools: textAnswer,
  manualStep: textAnswer,
  problems: textAnswer,
  humanDecisions: textAnswer,
}).partial().strict();

export type InterviewAnswers = z.infer<typeof interviewAnswersSchema>;

export const interviewDraftSchema = z.object({
  answers: interviewAnswersSchema,
  currentStep: z.number().int().min(0).max(11),
  currentScreen: z.enum(["welcome", "questions", "review", "done"]),
}).strict();

const requiredForReview: (keyof InterviewAnswers)[] = [
  "companyName",
  "sector",
  "processName",
  "frequency",
  "cases",
  "minutes",
];

function isKnownAnswer(value: string | undefined) {
  return value !== undefined && value.trim() !== "" && !specialAnswers.includes(value.trim() as typeof specialAnswers[number]);
}

export function reviewInterviewAnswers(answers: InterviewAnswers) {
  const missing = requiredForReview.filter((field) => !isKnownAnswer(answers[field]));
  const knownFrequency = isKnownAnswer(answers.frequency);
  const hasCaseCount = isKnownAnswer(answers.cases);

  return {
    missing,
    inconsistencies: hasCaseCount && !knownFrequency ? ["case_count_without_frequency"] : [],
  };
}