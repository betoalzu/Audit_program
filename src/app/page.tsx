"use client";

import { ChangeEvent, useEffect, useState } from "react";
import type { FollowUpResponse, InterviewAnalysis } from "@/lib/ai/interview-analysis";

type Answer = string;

type InterviewLoadResponse = {
  interview: {
    answers: Record<string, Answer>;
    currentStep: number;
    currentScreen: "welcome" | "questions" | "review" | "done";
  } | null;
};

type AnalysisResponse = {
  analysis?: InterviewAnalysis;
  followUpResponses?: FollowUpResponse[];
  error?: string;
};

type Question = {
  id: string;
  eyebrow: string;
  title: string;
  hint: string;
  type: "text" | "textarea" | "number" | "select";
  placeholder?: string;
  options?: string[];
};

const questions: Question[] = [
  {
    id: "companyName",
    eyebrow: "Sobre tu empresa",
    title: "¿Cómo se llama tu empresa?",
    hint: "Usaremos este nombre solo para identificar el diagnóstico.",
    type: "text",
    placeholder: "Ej. Suministros Norte",
  },
  {
    id: "sector",
    eyebrow: "Sobre tu empresa",
    title: "¿A qué se dedica principalmente?",
    hint: "Puedes describirlo con tus propias palabras.",
    type: "text",
    placeholder: "Ej. Distribución de material de oficina",
  },
  {
    id: "location",
    eyebrow: "Sobre tu empresa",
    title: "¿Dónde está ubicada?",
    hint: "Indica ciudad, provincia o país. No necesitamos una dirección.",
    type: "text",
    placeholder: "Ej. Valencia, España",
  },
  {
    id: "processName",
    eyebrow: "El proceso",
    title: "¿Qué proceso quieres analizar?",
    hint: "En esta demo analizaremos un solo proceso.",
    type: "text",
    placeholder: "Ej. Recepción y registro de pedidos",
  },
  {
    id: "processGoal",
    eyebrow: "El proceso",
    title: "¿Qué resultado debería producir este proceso?",
    hint: "Piensa en cómo sabes que el proceso ha terminado correctamente.",
    type: "textarea",
    placeholder: "Ej. Que el pedido quede registrado y confirmado al cliente.",
  },
  {
    id: "frequency",
    eyebrow: "Volumen y tiempo",
    title: "¿Con qué frecuencia se realiza?",
    hint: "Selecciona la unidad que te resulte más fácil de estimar.",
    type: "select",
    options: ["Varias veces al día", "Cada día", "Cada semana", "Cada mes", "No lo sé"],
  },
  {
    id: "cases",
    eyebrow: "Volumen y tiempo",
    title: "¿Cuántos casos gestionáis en ese periodo?",
    hint: "Una aproximación es válida. También puedes indicar que no lo sabes.",
    type: "number",
    placeholder: "Ej. 120",
  },
  {
    id: "minutes",
    eyebrow: "Volumen y tiempo",
    title: "¿Cuántos minutos requiere cada caso?",
    hint: "Indica el tiempo de trabajo de una persona, si lo conoces.",
    type: "number",
    placeholder: "Ej. 8",
  },
  {
    id: "tools",
    eyebrow: "Cómo se realiza",
    title: "¿Qué herramientas utilizáis?",
    hint: "Incluye correo, hojas de cálculo, ERP, teléfono u otras.",
    type: "textarea",
    placeholder: "Ej. Correo electrónico, Excel y nuestro ERP",
  },
  {
    id: "manualStep",
    eyebrow: "Cómo se realiza",
    title: "¿Qué parte se hace manualmente o se repite más?",
    hint: "Describe una tarea concreta, sin necesidad de usar términos técnicos.",
    type: "textarea",
    placeholder: "Ej. Copiamos los datos del correo al ERP y comprobamos los precios.",
  },
  {
    id: "problems",
    eyebrow: "Puntos de fricción",
    title: "¿Qué problemas aparecen con más frecuencia?",
    hint: "Puedes mencionar errores, esperas, retrabajo o excepciones.",
    type: "textarea",
    placeholder: "Ej. A veces falta una referencia y tenemos que volver a contactar.",
  },
  {
    id: "humanDecisions",
    eyebrow: "Puntos de fricción",
    title: "¿Qué decisiones requieren criterio humano?",
    hint: "Es importante saber qué no debería automatizarse sin supervisión.",
    type: "textarea",
    placeholder: "Ej. Revisar descuentos especiales y pedidos urgentes.",
  },
];

const specialAnswers = ["No lo sé", "No aplica", "Prefiero no responder"];

const initialAnswers: Record<string, Answer> = {};

async function readJson<T>(response: Response): Promise<T | null> {
  const body = await response.text();
  if (!body) return null;

  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

function questionLabel(field: string) {
  return questions.find((question) => question.id === field)?.title ?? field;
}

function confidenceLabel(confidence: "low" | "medium" | "high") {
  return { low: "baja", medium: "media", high: "alta" }[confidence];
}

function issueCategoryLabel(category: "missing" | "ambiguous" | "inconsistent" | "low_confidence") {
  return {
    missing: "dato faltante",
    ambiguous: "respuesta ambigua",
    inconsistent: "posible contradicción",
    low_confidence: "confianza baja",
  }[category];
}

function LogoMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#0B132B" />
      <path d="M12 28L20 12L28 28" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 23H25" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="12" r="3" fill="#10B981" />
      <circle cx="12" cy="28" r="2.5" fill="#06B6D4" />
      <circle cx="28" cy="28" r="2.5" fill="#06B6D4" />
      <path d="M20 12V23" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-logo"><LogoMark /></span>
      <span className="brand-copy"><strong>Atlas de procesos</strong><small>Entrevista de diagnóstico estructural</small></span>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "questions" | "review" | "done">("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>(initialAnswers);
  const [hasInterview, setHasInterview] = useState(false);
  const [storageState, setStorageState] = useState<"loading" | "saved" | "saving" | "temporary" | "error">("loading");
  const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
  const [analysisState, setAnalysisState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [analysisConsent, setAnalysisConsent] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [followUpResponses, setFollowUpResponses] = useState<FollowUpResponse[]>([]);
  const [followUpDrafts, setFollowUpDrafts] = useState<Record<number, string>>({});
  const [savingFollowUp, setSavingFollowUp] = useState<number | null>(null);
  const [followUpError, setFollowUpError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/interview", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Interview storage is unavailable");
        const result = await readJson<InterviewLoadResponse>(response);
        if (!result) throw new Error("Interview storage returned an invalid response");
        return result;
      })
      .then((result) => {
        if (!active) return;
        if (result.interview) {
          setAnswers(result.interview.answers);
          setQuestionIndex(result.interview.currentStep);
          setScreen(result.interview.currentScreen);
          setHasInterview(true);
        }
        setStorageState("saved");
      })
      .catch(() => {
        if (active) setStorageState("temporary");
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hasInterview) return;

    const timeout = window.setTimeout(() => {
      setStorageState("saving");
      fetch("/api/interview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, currentStep: questionIndex, currentScreen: screen }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Interview save failed");
          setStorageState("saved");
        })
        .catch(() => setStorageState("error"));
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [answers, hasInterview, questionIndex, screen]);

  const currentQuestion = questions[questionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || "" : "";
  const currentInputValue = currentQuestion?.type === "number" && specialAnswers.includes(currentAnswer)
    ? ""
    : currentAnswer;
  const progress = Math.round(((questionIndex + 1) / questions.length) * 100);

  async function beginInterview() {
    if (!hasInterview && storageState !== "temporary") {
      try {
        const response = await fetch("/api/interview", { method: "POST" });
        if (!response.ok) throw new Error("Interview storage is unavailable");
        setHasInterview(true);
        setStorageState("saved");
      } catch {
        setStorageState("temporary");
      }
    }
    setScreen("questions");
    setQuestionIndex(0);
  }

  function updateAnswer(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: event.target.value }));
  }

  function chooseSpecialAnswer(answer: string) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer }));
  }

  async function analyzeInterview() {
    if (!analysisConsent || analysisState === "loading") return;

    setAnalysisState("loading");
    setAnalysisError("");
    try {
      const response = await fetch("/api/interview/analyze", { method: "POST" });
      const result = await readJson<AnalysisResponse>(response);
      if (!response.ok) {
        const messages: Record<string, string> = {
          ai_not_configured: "La revisión con IA todavía no está configurada.",
          analysis_limit_reached: "Ya se alcanzó el límite de análisis para esta entrevista.",
          analysis_in_progress: "El análisis de esta entrevista ya está en curso.",
          invalid_ai_analysis: "La revisión no pudo verificar el origen de todos los hallazgos.",
          ai_service_unavailable: "El servicio de revisión no está disponible ahora.",
        };
        throw new Error(messages[result?.error ?? ""] ?? "No se pudo analizar la entrevista.");
      }
      if (!result?.analysis) throw new Error("La respuesta del análisis no es válida.");

      setAnalysis(result.analysis);
      setFollowUpResponses(result.followUpResponses ?? []);
      setFollowUpDrafts({});
      setAnalysisState("ready");
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "No se pudo analizar la entrevista.");
      setAnalysisState("error");
    }
  }

  async function saveFollowUp(issueIndex: number, skipped: boolean) {
    const answer = followUpDrafts[issueIndex]?.trim() ?? "";
    if (!skipped && !answer) {
      setFollowUpError("Escribe una aclaración o indica que prefieres no contestar.");
      return;
    }

    setSavingFollowUp(issueIndex);
    setFollowUpError("");
    try {
      const response = await fetch("/api/interview/analyze", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueIndex, answer: skipped ? null : answer, skipped }),
      });
      const result = await readJson<{ followUpResponses?: FollowUpResponse[] }>(response);
      if (!response.ok || !result?.followUpResponses) throw new Error("No se pudo guardar la aclaración.");

      setFollowUpResponses(result.followUpResponses);
    } catch (error) {
      setFollowUpError(error instanceof Error ? error.message : "No se pudo guardar la aclaración.");
    } finally {
      setSavingFollowUp(null);
    }
  }

  function goNext() {
    if (questionIndex === questions.length - 1) {
      setScreen("review");
      return;
    }
    setQuestionIndex((previous) => previous + 1);
  }

  function goBack() {
    if (questionIndex === 0) {
      setScreen("welcome");
      return;
    }
    setQuestionIndex((previous) => previous - 1);
  }

  if (screen === "welcome") {
    return (
      <main className="shell">
        <header className="topbar">
          <Brand />
          <span className="status"><span className="status-dot" /> {storageState === "saved" && hasInterview ? "Guardado" : storageState === "saved" ? "Preparado" : storageState === "loading" ? "Conectando" : "Temporal"}</span>
        </header>
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">Diagnóstico operativo · versión inicial</p>
            <h1>Entiende qué parte de tu trabajo podría ser más sencilla.</h1>
            <p className="hero-lead">Una entrevista breve para detectar tareas repetitivas en un proceso real de tu empresa. Tú revisas los datos antes de recibir cualquier conclusión.</p>
            <p className="demo-note">Las respuestas se guardan en PostgreSQL y se vinculan a este navegador, sin crear una cuenta. No incluyas información personal ni confidencial.</p>
            <button className="primary-button" onClick={beginInterview} disabled={storageState === "loading"}>Comenzar entrevista <span aria-hidden="true">→</span></button>
            {storageState === "temporary" && <p className="demo-note" role="status">No se pudo conectar con el almacenamiento. Las respuestas de esta sesión serán temporales.</p>}
            <div className="trust-row"><span>Sin micrófono</span><span>Sin datos personales</span><span>Revisable</span></div>
          </div>
          <aside className="intro-panel" aria-label="Información de la entrevista">
            <div className="panel-topline"><span className="panel-number">01</span><span>Antes de empezar</span></div>
            <h2>Una conversación escrita, a tu ritmo.</h2>
            <p>Te haremos preguntas sobre un único proceso. No hace falta conocer cifras exactas: podrás indicar cuándo no lo sabes.</p>
            <dl className="fact-list"><div><dt>Duración</dt><dd>5–8 min</dd></div><div><dt>Alcance</dt><dd>1 proceso</dd></div><div><dt>Resultado</dt><dd>Resumen revisable</dd></div></dl>
          </aside>
        </section>
        <footer className="page-footer"><span>Primero texto. La voz será siempre opcional.</span><span>Fase 3 · Revisión asistida opcional</span></footer>
      </main>
    );
  }

  if (screen === "review") {
    return (
      <main className="shell narrow-shell">
        <header className="topbar"><Brand /><span className="status"><span className="status-dot" /> Revisión</span></header>
        <section className="review-header"><p className="kicker">Último paso</p><h1>Revisa lo que hemos entendido.</h1><p>Estos datos son un borrador editable. El diagnóstico se definirá en fases posteriores, con datos validados.</p></section>
        <section className="analysis-panel" aria-labelledby="analysis-title">
          <div className="analysis-heading">
            <p className="kicker">Revisión asistida</p>
            <h2 id="analysis-title">Buscar datos que necesitan aclaración</h2>
            <p>Gemini analizará las respuestas guardadas, señalará posibles dudas y propondrá preguntas. No genera un diagnóstico.</p>
          </div>
          <label className="analysis-consent">
            <input type="checkbox" checked={analysisConsent} onChange={(event) => setAnalysisConsent(event.target.checked)} />
            <span>Autorizo enviar estas respuestas a Google Gemini para revisarlas.</span>
          </label>
          <button className="secondary-button" onClick={analyzeInterview} disabled={!analysisConsent || analysisState === "loading"}>
            {analysisState === "loading" ? "Analizando…" : analysisState === "ready" ? "Actualizar análisis" : "Analizar respuestas"}
          </button>
          <p className="analysis-caution">Se usa el plan de pago de Google. Máximo dos análisis por entrevista; los resultados son sugerencias y deben revisarse.</p>
          {analysisState === "error" && <p className="analysis-message" role="alert">{analysisError}</p>}
          {analysisState === "loading" && <p className="analysis-message" role="status">Revisando las respuestas guardadas…</p>}
        </section>
        {analysis && <section className="analysis-results" aria-label="Hallazgos que requieren revisión" aria-live="polite">
          <h2>Hallazgos para revisar</h2>
          {analysis.issues.length === 0 && <p>No se detectaron datos que requieran aclaración.</p>}
          {analysis.issues.map((issue, index) => <article className="analysis-item" key={`${issue.category}-${index}`}>
            <span className="summary-label">{issueCategoryLabel(issue.category)} · {issue.confidence ? `confianza ${confidenceLabel(issue.confidence)} · ` : ""}{issue.fields.map(questionLabel).join(", ")}</span>
            <strong>{issue.explanation}</strong>
            {issue.evidence.map((evidence, evidenceIndex) => <blockquote key={`${evidence.sourceField}-${evidenceIndex}`}>
              “{evidence.quote}” <cite>· {questionLabel(evidence.sourceField)}</cite>
            </blockquote>)}
            {issue.followUpQuestion && <div className="follow-up">
              <p className="analysis-question"><span>Pregunta de aclaración:</span> {issue.followUpQuestion}</p>
              {followUpResponses.find((response) => response.issueIndex === index) ? <p className="follow-up-status" role="status">{followUpResponses.find((response) => response.issueIndex === index)?.skipped ? "Prefieres no contestar esta pregunta." : "Aclaración guardada."}</p> : <>
                <label className="follow-up-label" htmlFor={`follow-up-${index}`}>Tu respuesta (opcional)</label>
                <textarea id={`follow-up-${index}`} value={followUpDrafts[index] ?? ""} onChange={(event) => setFollowUpDrafts((previous) => ({ ...previous, [index]: event.target.value }))} rows={3} />
                <div className="follow-up-actions">
                  <button className="secondary-button" onClick={() => saveFollowUp(index, false)} disabled={savingFollowUp === index}>{savingFollowUp === index ? "Guardando…" : "Guardar aclaración"}</button>
                  <button className="text-button" onClick={() => saveFollowUp(index, true)} disabled={savingFollowUp === index}>Prefiero no contestar</button>
                </div>
              </>}
            </div>}
          </article>)}
          {followUpError && <p className="analysis-message" role="alert">{followUpError}</p>}
          <p className="analysis-caution">Las citas indican de dónde salió cada hallazgo. Confirma o corrige las respuestas antes de continuar.</p>
        </section>}
        <div className="review-actions"><button className="secondary-button" onClick={() => { setAnalysis(null); setAnalysisState("idle"); setQuestionIndex(questions.length - 1); setScreen("questions"); }}>Editar respuestas</button><button className="primary-button" onClick={() => setScreen("done")}>Confirmar resumen <span aria-hidden="true">→</span></button></div>
      </main>
    );
  }

  if (screen === "done") {
    return (
      <main className="shell centered-shell"><div className="success-mark">✓</div><p className="kicker">Entrevista completada</p><h1>Ya tenemos una primera imagen del proceso.</h1><p className="hero-lead">La entrevista termina aquí. Las sugerencias de revisión son orientativas; todavía no se ha calculado un diagnóstico ni un ahorro.</p><button className="secondary-button" onClick={() => setScreen("review")}>Revisar respuestas</button><p className="demo-note">Fase 3 · Revisión asistida opcional</p></main>
    );
  }

  return (
    <main className="shell narrow-shell">
      <header className="topbar"><button className="back-link" onClick={goBack} aria-label={questionIndex === 0 ? "Salir de la entrevista" : "Volver a la pregunta anterior"}>← <span>{questionIndex === 0 ? "Salir" : "Anterior"}</span></button><Brand /><div className="progress-meta"><strong>{questionIndex + 1}</strong><span>/ {questions.length}</span><small>Tiempo est.: ~7 min</small></div></header>
      <div className="progress-track" aria-label={`Progreso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <section className="question-section">
        <p className="kicker">{currentQuestion.eyebrow}</p>
        <h1>{currentQuestion.title}</h1>
        <p className="question-hint">{currentQuestion.hint}</p>
        <div className="answer-area">
          {currentQuestion.type === "textarea" ? <textarea autoFocus value={currentAnswer} onChange={updateAnswer} placeholder={currentQuestion.placeholder} rows={5} /> : currentQuestion.type === "select" ? <select autoFocus value={currentAnswer} onChange={updateAnswer}><option value="">Selecciona una opción</option>{currentQuestion.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input autoFocus type={currentQuestion.type} value={currentInputValue} onChange={updateAnswer} placeholder={currentQuestion.placeholder} min={currentQuestion.type === "number" ? 0 : undefined} />}
          <div className="special-options"><span>También puedes responder:</span>{specialAnswers.map((answer) => <button key={answer} className={`chip ${currentAnswer === answer ? "selected" : ""}`} onClick={() => chooseSpecialAnswer(answer)}>{answer}</button>)}</div>
        </div>
      </section>
      <footer className="question-footer"><span className="save-note" role="status">{storageState === "saving" ? "Guardando…" : storageState === "saved" && hasInterview ? "Guardado" : storageState === "error" ? "No se pudo guardar; vuelve a intentarlo" : "Respuestas temporales"}</span><button className="primary-button" onClick={goNext}>{questionIndex === questions.length - 1 ? "Revisar respuestas" : "Continuar"} <span aria-hidden="true">→</span></button></footer>
    </main>
  );
}
