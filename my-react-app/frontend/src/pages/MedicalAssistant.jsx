import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CircleCheckBig,
  CircleHelp,
  Info,
  Pill,
  Send,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound
} from "lucide-react";
import pharmacyInteriorImage from "../assets/pharmacy-interior.jpg";
import pharmacyShelfImage from "../assets/pharmacy-shelf.jpg";
import pillBottleImage from "../assets/medicine-pill-bottle.jpg";
import api from "../services/api";
import "../styles/MedicalAssistant.css";

const QUICK_PROMPTS = [
  "What is vitamin C?",
  "What is Dolo 650 used for?",
  "What are the side effects of ibuprofen?",
  "When should I seek urgent care?"
];

const WELCOME_MESSAGE =
  "Ask about a medicine, vitamin, or symptom. I will answer from the local RAG knowledge base when possible and fall back to safe general guidance when needed.";

function createMessage(role, text, meta = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    meta
  };
}

function riskChipClass(riskLevel) {
  if (riskLevel === "high") {
    return "status-chip status-chip--danger";
  }

  if (riskLevel === "medium") {
    return "status-chip status-chip--warning";
  }

  return "status-chip status-chip--success";
}

function riskLabel(riskLevel) {
  if (riskLevel === "high") {
    return "High risk";
  }

  if (riskLevel === "medium") {
    return "Medium risk";
  }

  return "Low risk";
}

function MedicalAssistant() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [latestResponse, setLatestResponse] = useState(null);
  const [messages, setMessages] = useState(() => [
    createMessage("assistant", WELCOME_MESSAGE, { status: "ready" })
  ]);
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, loading]);

  function handlePrompt(prompt) {
    setMessage(prompt);
  }

  function clearChat() {
    if (loading) {
      return;
    }

    setMessage("");
    setConversationId(null);
    setLatestResponse(null);
    setMessages([createMessage("assistant", WELCOME_MESSAGE, { status: "ready" })]);
  }

  async function handleAsk(event) {
    if (event) {
      event.preventDefault();
    }

    const query = message.trim();
    if (!query || loading) {
      return;
    }

    setMessages((prev) => [...prev, createMessage("user", query)]);
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/medical-assistant/chat", {
        message: query,
        conversationId
      });

      const data = response.data || {};
      const answer =
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer.trim()
          : "I could not generate a safe answer right now.";
      const citations = Array.isArray(data.citations) ? data.citations : [];
      const assistantMeta = {
        citations,
        confidence: typeof data.confidence === "number" ? data.confidence : null,
        riskLevel: data.riskLevel || "low",
        needsUrgentCare: Boolean(data.needsUrgentCare),
        retrievalMode: data.retrievalMode || null,
        generationProvider: data.generationProvider || null,
        generationError: data.generationError || null
      };

      setConversationId(data.conversationId || conversationId || null);
      setLatestResponse({
        ...data,
        answer,
        citations
      });
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", answer, assistantMeta)
      ]);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "The medical assistant is temporarily unavailable. Please try again in a moment.";

      setLatestResponse(null);
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", errorMessage, {
          riskLevel: "medium",
          generationError: error?.message || null
        })
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleAsk();
    }
  }

  const confidenceValue =
    latestResponse && typeof latestResponse.confidence === "number"
      ? Math.round(latestResponse.confidence * 100)
      : null;
  const citations = Array.isArray(latestResponse?.citations)
    ? latestResponse.citations
    : [];

  return (
    <div className="page medical-assistant-page">
      <section className="medical-hero card">
        <div className="medical-hero__copy">
          <p className="eyebrow">Medical assistant</p>
          <h1 className="medical-hero__title">
            Clinical answers, grounded in your knowledge base.
          </h1>
          <p className="medical-hero__text">
            Ask about medicines, vitamins, common uses, or warning signs. The
            assistant uses retrieved medical context when available and falls
            back to safe general guidance when the local knowledge base is thin.
          </p>

          <div className="medical-hero__flags">
            <span className="medical-hero__flag">
              <ShieldCheck aria-hidden="true" />
              Safety checked
            </span>
            <span className="medical-hero__flag">
              <Pill aria-hidden="true" />
              Medicine focused
            </span>
            <span className="medical-hero__flag">
              <CircleCheckBig aria-hidden="true" />
              Citations when available
            </span>
          </div>

          <div className="metric-grid metric-grid--three">
            <div className="metric-card">
              <strong>Grounded answers</strong>
              <span>
                Uses the FastAPI RAG service and returns the best available
                local context first.
              </span>
            </div>
            <div className="metric-card">
              <strong>Safer fallback</strong>
              <span>
                Gives brief general guidance for common low-risk questions when
                the corpus is sparse.
              </span>
            </div>
            <div className="metric-card">
              <strong>Emergency aware</strong>
              <span>
                Urgent symptoms are flagged immediately with a clear care
                warning.
              </span>
            </div>
          </div>
        </div>

        <div className="medical-hero__panel">
          <div className="medical-gallery">
            <div className="medical-gallery__main media-frame">
              <img
                src={pharmacyShelfImage}
                alt="Pharmacy shelves stocked with trusted medicine boxes"
              />
              <div className="medical-gallery__badge">
                Trusted sources, clear guidance
              </div>
            </div>

            <div className="medical-gallery__stack">
              <div className="medical-gallery__tile media-frame">
                <img
                  src={pillBottleImage}
                  alt="Medicine capsules spilling from a white bottle"
                />
              </div>
              <div className="medical-gallery__tile media-frame">
                <img
                  src={pharmacyInteriorImage}
                  alt="A modern pharmacy interior with stocked medicine shelves"
                />
              </div>
            </div>
          </div>

          <div className="medical-flow">
            <div className="medical-flow__step">
              <strong>1</strong>
              <span>Ask a medication or symptom question.</span>
            </div>
            <div className="medical-flow__step">
              <strong>2</strong>
              <span>The RAG service retrieves the closest medical context.</span>
            </div>
            <div className="medical-flow__step">
              <strong>3</strong>
              <span>The assistant returns a safe, readable answer.</span>
            </div>
          </div>

          <div className="prompt-grid medical-hero__prompts">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="btn btn--ghost prompt-chip"
                onClick={() => handlePrompt(prompt)}
              >
                <CircleHelp aria-hidden="true" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="medical-layout">
        <aside className="medical-sidebar">
          <article className="card medical-panel">
            <p className="medical-panel__title">
              <Stethoscope aria-hidden="true" />
              What it does
            </p>
            <p className="medical-panel__text">
              The assistant answers medicine questions, explains common uses,
              and highlights safety notes when the knowledge base has matching
              context.
            </p>
            <ul className="soft-list">
              <li>Shows citations when it finds a strong match.</li>
              <li>Falls back to a brief general answer for common topics.</li>
              <li>Warns clearly for urgent symptoms and emergency signs.</li>
            </ul>
          </article>

          <article className="card medical-panel medical-panel--danger">
            <p className="medical-panel__title">
              <AlertTriangle aria-hidden="true" />
              Medical safety
            </p>
            <p className="medical-panel__text">
              This is not a replacement for a clinician. For chest pain,
              breathing trouble, severe allergic reactions, seizures, heavy
              bleeding, or suicidal thoughts, seek urgent medical help.
            </p>
          </article>

          <article className="card medical-panel">
            <p className="medical-panel__title">
              <Info aria-hidden="true" />
              Quick examples
            </p>
            <div className="prompt-grid">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={`sidebar-${prompt}`}
                  type="button"
                  className="btn btn--ghost prompt-chip"
                  onClick={() => handlePrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </article>
        </aside>

        <section className="card medical-chat">
          <form className="medical-form" onSubmit={handleAsk}>
            <div className="medical-form__header">
              <div>
                <p className="eyebrow">Ask the assistant</p>
                <h2 className="section-title">Try a medicine question</h2>
              </div>
              <span className="badge">
                {loading ? "Working" : "FastAPI RAG"}
              </span>
            </div>

            <textarea
              className="field medical-textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Dolo 650, vitamin C, ibuprofen, side effects, dosage cautions, or when to seek care..."
            />

            <div className="medical-form__footer">
              <p className="medical-form__hint">
                Press <strong>Ctrl + Enter</strong> to send from the keyboard.
                Keep dosage, pregnancy, or child-related questions for a
                pharmacist or clinician.
              </p>

              <div className="medical-actions">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={clearChat}
                  disabled={loading}
                >
                  <Trash2 aria-hidden="true" />
                  Clear
                </button>
                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={loading || !message.trim()}
                >
                  <Send aria-hidden="true" />
                  {loading ? "Thinking..." : "Ask assistant"}
                </button>
              </div>
            </div>
          </form>

          <div className="medical-thread" aria-live="polite">
            {messages.map((item) => (
              <article
                key={item.id}
                className={`medical-message medical-message--${item.role}`}
              >
                <div className="medical-message__avatar">
                  {item.role === "assistant" ? (
                    <Bot aria-hidden="true" />
                  ) : (
                    <UserRound aria-hidden="true" />
                  )}
                </div>

                <div className="medical-message__content">
                  <div className="medical-message__bubble">{item.text}</div>

                  {item.role === "assistant" && (
                    <div className="medical-message__meta">
                      {typeof item.meta.confidence === "number" && (
                        <span className="status-chip status-chip--success">
                          Confidence {Math.round(item.meta.confidence * 100)}%
                        </span>
                      )}
                      {item.meta.retrievalMode && (
                        <span className="status-chip">Mode {item.meta.retrievalMode}</span>
                      )}
                      {item.meta.needsUrgentCare && (
                        <span className="status-chip status-chip--danger">
                          Urgent care
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}

            {loading && (
              <article className="medical-message medical-message--assistant medical-message--loading">
                <div className="medical-message__avatar">
                  <Bot aria-hidden="true" />
                </div>
                <div className="medical-message__content">
                  <div className="medical-message__bubble medical-message__bubble--loading">
                    <span className="loading-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    Looking up the safest grounded answer...
                  </div>
                </div>
              </article>
            )}

            <div ref={threadEndRef} />
          </div>

          {latestResponse && (
            <section className="response-board">
              {latestResponse.needsUrgentCare && (
                <div className="notice notice--danger">
                  <AlertTriangle
                    className="notice__icon"
                    aria-hidden="true"
                  />
                  <div>
                    <strong>Urgent care recommended.</strong>
                    <p>
                      The assistant detected symptoms that may need immediate
                      medical attention.
                    </p>
                  </div>
                </div>
              )}

              {latestResponse.generationError && (
                <div className="notice notice--warning">
                  <Info className="notice__icon" aria-hidden="true" />
                  <div>
                    <strong>Fallback used.</strong>
                    <p>{latestResponse.generationError}</p>
                  </div>
                </div>
              )}

              <article className="card response-card">
                <div className="response-card__header">
                  <div>
                    <p className="eyebrow">Latest answer</p>
                    <h3 className="response-card__title">
                      Grounded medical summary
                    </h3>
                  </div>

                  <div className="response-meta">
                    <span className={riskChipClass(latestResponse.riskLevel)}>
                      {riskLabel(latestResponse.riskLevel)}
                    </span>
                    <span className="status-chip status-chip--success">
                      {latestResponse.generationProvider || "fastapi"}
                    </span>
                    {latestResponse.retrievalMode && (
                      <span className="status-chip">
                        {latestResponse.retrievalMode}
                      </span>
                    )}
                  </div>
                </div>

                <p className="response-card__answer">{latestResponse.answer}</p>

                <div className="confidence-block">
                  <div className="confidence-block__row">
                    <span>Confidence</span>
                    <strong>
                      {confidenceValue !== null ? `${confidenceValue}%` : "N/A"}
                    </strong>
                  </div>
                  <div className="confidence-track" aria-hidden="true">
                    <div
                      className="confidence-track__bar"
                      style={{
                        width: `${confidenceValue ?? 0}%`
                      }}
                    />
                  </div>
                </div>

                <p className="medical-form__hint response-card__note">
                  {citations.length
                    ? "Citations are shown below. Use them to inspect the matched medical source."
                    : "No local source matched closely, so the assistant gave a safe general answer."}
                </p>
              </article>

              <div className="citation-grid">
                {citations.length ? (
                  citations.map((citation, index) => (
                    <article className="citation-card" key={`${citation.sourceId || "citation"}-${index}`}>
                      <div className="citation-card__head">
                        <strong className="citation-card__title">
                          {citation.title || "Medical source"}
                        </strong>
                        {citation.page ? (
                          <span className="status-chip">Page {citation.page}</span>
                        ) : null}
                      </div>
                      <p className="citation-card__meta">
                        {citation.sourceId || "source unavailable"}
                      </p>
                      <p className="citation-card__snippet">
                        {citation.snippet || "No snippet available."}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="empty-note">
                    The local knowledge base did not return a direct match. The
                    answer above is still generated in a safe, general way for
                    common low-risk questions.
                  </div>
                )}
              </div>
            </section>
          )}
        </section>
      </section>
    </div>
  );
}

export default MedicalAssistant;
