import { describe, expect, it } from "vitest";
import { analysisHasSourceEvidence, followUpResponseSchema, hashInterviewAnswers, interviewAnalysisSchema } from "./interview-analysis";

const answers = {
  processName: "Recepción de pedidos",
  manualStep: "Copiamos los pedidos del correo al ERP",
} as const;

const validAnalysis = {
  facts: [{
    field: "manualStep",
    value: "Copiar pedidos del correo al ERP",
    sourceField: "manualStep",
    evidence: "Copiamos los pedidos del correo al ERP",
    confidence: "high",
  }],
  issues: [{
    category: "ambiguous",
    fields: ["manualStep"],
    explanation: "No se indica cuánto tarda esta tarea.",
    evidence: [{
      sourceField: "manualStep",
      quote: "Copiamos los pedidos del correo al ERP",
    }],
    confidence: null,
    followUpQuestion: "¿Cuánto tiempo suele tomar copiar un pedido?",
  }],
} as const;

describe("structured interview analysis", () => {
  it("hashes the same answers regardless of property order", () => {
    expect(hashInterviewAnswers({ processName: "Recepción", manualStep: "Copiar pedidos" }))
      .toBe(hashInterviewAnswers({ manualStep: "Copiar pedidos", processName: "Recepción" }));
  });

  it("accepts findings with known interview fields", () => {
    expect(interviewAnalysisSchema.safeParse(validAnalysis).success).toBe(true);
  });

  it("rejects fields that do not belong to the interview", () => {
    const invalidAnalysis = {
      ...validAnalysis,
      facts: [{ ...validAnalysis.facts[0], field: "unknownField" }],
    };

    expect(interviewAnalysisSchema.safeParse(invalidAnalysis).success).toBe(false);
  });

  it("rejects semantic issues without a source quote", () => {
    const uncitedAnalysis = interviewAnalysisSchema.parse({
      ...validAnalysis,
      issues: [{ ...validAnalysis.issues[0], evidence: [] }],
    });

    expect(analysisHasSourceEvidence(uncitedAnalysis, answers)).toBe(false);
  });

  it("allows a missing-field issue without a quote only when the field is unknown", () => {
    const missingAnalysis = interviewAnalysisSchema.parse({
      facts: [],
      issues: [{
        category: "missing",
        fields: ["processGoal"],
        explanation: "No se indicó el objetivo del proceso.",
        evidence: [],
        confidence: null,
        followUpQuestion: "¿Qué resultado debería producir el proceso?",
      }],
    });

    expect(analysisHasSourceEvidence(missingAnalysis, answers)).toBe(true);
    expect(analysisHasSourceEvidence(missingAnalysis, { ...answers, processGoal: "Preparar pedidos" })).toBe(false);
  });

  it("requires evidence quotes to come from the cited answer", () => {
    const parsed = interviewAnalysisSchema.parse(validAnalysis);
    expect(analysisHasSourceEvidence(parsed, answers)).toBe(true);

    const fabricated = interviewAnalysisSchema.parse({
      ...validAnalysis,
      facts: [{ ...validAnalysis.facts[0], evidence: "We automate every order" }],
    });
    expect(analysisHasSourceEvidence(fabricated, answers)).toBe(false);
  });

  it("accepts a low-confidence finding with a clarification question", () => {
    const lowConfidenceAnalysis = interviewAnalysisSchema.safeParse({
      facts: [],
      issues: [{
        category: "low_confidence",
        fields: ["manualStep"],
        explanation: "La descripción no concreta cómo se valida cada pedido.",
        evidence: [{
          sourceField: "manualStep",
          quote: "Copiamos los pedidos del correo al ERP",
        }],
        confidence: "low",
        followUpQuestion: "¿Qué comprobaciones hacéis antes de registrar cada pedido en el ERP?",
      }],
    });

    expect(lowConfidenceAnalysis.success).toBe(true);
  });

  it("allows a relevant finding without a follow-up question", () => {
    const withoutFollowUp = interviewAnalysisSchema.safeParse({
      facts: [],
      issues: [{
        category: "inconsistent",
        fields: ["cases"],
        explanation: "El volumen indicado no coincide con la frecuencia descrita.",
        evidence: [{ sourceField: "processName", quote: "Recepción de pedidos" }],
        confidence: null,
        followUpQuestion: null,
      }],
    });

    expect(withoutFollowUp.success).toBe(true);
  });

  it("accepts either a clarification response or an explicit omission", () => {
    expect(followUpResponseSchema.safeParse({
      issueIndex: 0,
      answer: "Comprobamos el precio y la referencia antes de registrarlo.",
      skipped: false,
    }).success).toBe(true);
    expect(followUpResponseSchema.safeParse({
      issueIndex: 0,
      answer: null,
      skipped: true,
    }).success).toBe(true);
    expect(followUpResponseSchema.safeParse({
      issueIndex: 0,
      answer: null,
      skipped: false,
    }).success).toBe(false);
  });
});