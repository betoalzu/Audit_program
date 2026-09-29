import { describe, expect, it } from "vitest";
import { analysisHasSourceEvidence, interviewAnalysisSchema } from "./interview-analysis";

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
    followUpQuestion: "¿Cuánto tiempo suele tomar copiar un pedido?",
  }],
} as const;

describe("structured interview analysis", () => {
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

  it("requires evidence quotes to come from the cited answer", () => {
    const parsed = interviewAnalysisSchema.parse(validAnalysis);
    expect(analysisHasSourceEvidence(parsed, answers)).toBe(true);

    const fabricated = interviewAnalysisSchema.parse({
      ...validAnalysis,
      facts: [{ ...validAnalysis.facts[0], evidence: "We automate every order" }],
    });
    expect(analysisHasSourceEvidence(fabricated, answers)).toBe(false);
  });
});