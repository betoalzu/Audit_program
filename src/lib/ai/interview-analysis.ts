import { z } from "zod";
import { specialAnswers, type InterviewAnswers } from "../interview-schema";

export const interviewFieldIds = [
  "companyName",
  "sector",
  "location",
  "processName",
  "processGoal",
  "frequency",
  "cases",
  "minutes",
  "tools",
  "manualStep",
  "problems",
  "humanDecisions",
] as const;

const fieldId = z.enum(interviewFieldIds);
const evidenceSchema = z.object({
  sourceField: fieldId,
  quote: z.string().min(1).max(500),
}).strict();

export const interviewAnalysisSchema = z.object({
  facts: z.array(z.object({
    field: fieldId,
    value: z.string().min(1).max(1000),
    sourceField: fieldId,
    evidence: z.string().min(1).max(500),
    confidence: z.enum(["low", "medium", "high"]),
  }).strict()).max(12),
  issues: z.array(z.object({
    category: z.enum(["missing", "ambiguous", "inconsistent"]),
    fields: z.array(fieldId).min(1).max(3),
    explanation: z.string().min(1).max(300),
    evidence: z.array(evidenceSchema).max(3),
    followUpQuestion: z.string().max(240).nullable(),
  }).strict()).max(5),
}).strict();

export type InterviewAnalysis = z.infer<typeof interviewAnalysisSchema>;

export function analysisHasSourceEvidence(analysis: InterviewAnalysis, answers: InterviewAnswers) {
  function isUnknownAnswer(field: keyof InterviewAnswers) {
    const answer = answers[field]?.trim();
    return !answer || specialAnswers.includes(answer as typeof specialAnswers[number]);
  }

  const factEvidenceIsValid = analysis.facts.every((fact) => {
    const source = answers[fact.sourceField]?.trim();
    return source !== undefined && source !== "" && source.includes(fact.evidence) && fact.evidence.trim() !== "";
  });

  const issueEvidenceIsValid = analysis.issues.every((issue) => {
    if (issue.evidence.length === 0) {
      return issue.category === "missing" && issue.fields.every(isUnknownAnswer);
    }

    return issue.evidence.every((evidence) => {
      const source = answers[evidence.sourceField]?.trim();
      return source !== undefined && source !== "" && source.includes(evidence.quote) && evidence.quote.trim() !== "";
    });
  });

  return factEvidenceIsValid && issueEvidenceIsValid;
}