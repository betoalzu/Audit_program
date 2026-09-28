"use client";

import { ChangeEvent, useState } from "react";

type Answer = string;

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

function displayAnswer(answer: Answer | undefined) {
  return answer?.trim() || "Sin respuesta";
}

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "questions" | "review" | "done">("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>(initialAnswers);

  const currentQuestion = questions[questionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || "" : "";
  const progress = Math.round(((questionIndex + 1) / questions.length) * 100);

  function beginInterview() {
    setScreen("questions");
    setQuestionIndex(0);
  }

  function updateAnswer(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: event.target.value }));
  }

  function chooseSpecialAnswer(answer: string) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer }));
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
          <div className="brand"><span className="brand-mark">A</span><span>Atlas de procesos</span></div>
          <span className="status"><span className="status-dot" /> Demo privada</span>
        </header>
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">Diagnóstico operativo · versión inicial</p>
            <h1>Entiende qué parte de tu trabajo podría ser más sencilla.</h1>
            <p className="hero-lead">Una entrevista breve para detectar tareas repetitivas en un proceso real de tu empresa. Tú revisas los datos antes de recibir cualquier conclusión.</p>
            <button className="primary-button" onClick={beginInterview}>Comenzar entrevista <span aria-hidden="true">→</span></button>
            <div className="trust-row"><span>Sin micrófono</span><span>Sin datos sensibles</span><span>Revisable</span></div>
          </div>
          <aside className="intro-panel" aria-label="Información de la entrevista">
            <div className="panel-topline"><span className="panel-number">01</span><span>Antes de empezar</span></div>
            <h2>Una conversación escrita, a tu ritmo.</h2>
            <p>Te haremos preguntas sobre un único proceso. No hace falta conocer cifras exactas: podrás indicar cuándo no lo sabes.</p>
            <dl className="fact-list"><div><dt>Duración</dt><dd>5–8 min</dd></div><div><dt>Alcance</dt><dd>1 proceso</dd></div><div><dt>Resultado</dt><dd>Resumen revisable</dd></div></dl>
          </aside>
        </section>
        <footer className="page-footer"><span>Primero texto. La voz será siempre opcional.</span><span>Fase 1 · Demo sin servicios externos</span></footer>
      </main>
    );
  }

  if (screen === "review") {
    return (
      <main className="shell narrow-shell">
        <header className="topbar"><div className="brand"><span className="brand-mark">A</span><span>Atlas de procesos</span></div><span className="status"><span className="status-dot" /> Revisión</span></header>
        <section className="review-header"><p className="kicker">Último paso</p><h1>Revisa lo que hemos entendido.</h1><p>Estos datos son un borrador editable. En la siguiente fase se usarán para calcular el diagnóstico.</p></section>
        <section className="summary-card" aria-label="Resumen de respuestas">
          {questions.map((question, index) => <div className="summary-row" key={question.id}><div><span className="summary-label">{question.title}</span><strong>{displayAnswer(answers[question.id])}</strong></div><button className="text-button" onClick={() => { setQuestionIndex(index); setScreen("questions"); }}>Editar</button></div>)}
        </section>
        <div className="review-actions"><button className="secondary-button" onClick={() => { setQuestionIndex(questions.length - 1); setScreen("questions"); }}>Volver</button><button className="primary-button" onClick={() => setScreen("done")}>Confirmar resumen <span aria-hidden="true">→</span></button></div>
      </main>
    );
  }

  if (screen === "done") {
    return (
      <main className="shell centered-shell"><div className="success-mark">✓</div><p className="kicker">Entrevista completada</p><h1>Ya tenemos una primera imagen del proceso.</h1><p className="hero-lead">La demo termina aquí. En la siguiente fase añadiremos validación, cálculos y las reglas que convertirán estas respuestas en un diagnóstico prudente.</p><button className="secondary-button" onClick={() => setScreen("review")}>Revisar respuestas</button><p className="demo-note">Demo de Fase 1 · No se ha enviado información a ningún servicio externo.</p></main>
    );
  }

  return (
    <main className="shell narrow-shell">
      <header className="topbar"><button className="back-link" onClick={goBack} aria-label="Volver">← <span>Salir</span></button><div className="brand"><span className="brand-mark">A</span><span>Atlas de procesos</span></div><span className="step-count">{questionIndex + 1} / {questions.length}</span></header>
      <div className="progress-track" aria-label={`Progreso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <section className="question-section">
        <p className="kicker">{currentQuestion.eyebrow}</p>
        <h1>{currentQuestion.title}</h1>
        <p className="question-hint">{currentQuestion.hint}</p>
        <div className="answer-area">
          {currentQuestion.type === "textarea" ? <textarea autoFocus value={currentAnswer} onChange={updateAnswer} placeholder={currentQuestion.placeholder} rows={5} /> : currentQuestion.type === "select" ? <select autoFocus value={currentAnswer} onChange={updateAnswer}><option value="">Selecciona una opción</option>{currentQuestion.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input autoFocus type={currentQuestion.type} value={currentAnswer} onChange={updateAnswer} placeholder={currentQuestion.placeholder} min={currentQuestion.type === "number" ? 0 : undefined} />}
          <div className="special-options"><span>También puedes responder:</span>{specialAnswers.map((answer) => <button key={answer} className={`chip ${currentAnswer === answer ? "selected" : ""}`} onClick={() => chooseSpecialAnswer(answer)}>{answer}</button>)}</div>
        </div>
      </section>
      <footer className="question-footer"><span className="save-note">Guardado en esta demo</span><button className="primary-button" onClick={goNext}>{questionIndex === questions.length - 1 ? "Revisar respuestas" : "Continuar"} <span aria-hidden="true">→</span></button></footer>
    </main>
  );
}
