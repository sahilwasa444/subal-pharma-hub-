import axios from "axios";

const DEFAULT_BASE_URL = "http://127.0.0.1:8000";
const DEFAULT_TIMEOUT_MS = 15000;

function normalizeBaseUrl(value) {
  return String(value || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function getRagServiceBaseUrl() {
  return normalizeBaseUrl(
    process.env.RAG_SERVICE_URL || process.env.RAG_SERVICE_BASE_URL
  );
}

function getTimeoutMs() {
  const raw = Number(process.env.RAG_SERVICE_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}

function normalizeCitations(citations) {
  if (!Array.isArray(citations)) {
    return [];
  }

  return citations
    .filter(Boolean)
    .map((citation) => ({
      title: citation.title || citation.name || "medical-source",
      sourceId: citation.sourceId || citation.source_id || null,
      chunkId: citation.chunkId || citation.chunk_id || null,
      snippet: citation.snippet || null,
      page:
        typeof citation.page === "number"
          ? citation.page
          : citation.page
            ? Number(citation.page)
            : null,
    }));
}

export async function askRagService({
  message,
  conversationId = null,
  locale = "en-US",
} = {}) {
  const payload = {
    message,
    conversationId,
    locale,
  };

  try {
    const response = await axios.post(
      `${getRagServiceBaseUrl()}/chat`,
      payload,
      {
        timeout: getTimeoutMs(),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data || {};

    return {
      answer: typeof data.answer === "string" ? data.answer : "",
      citations: normalizeCitations(data.citations),
      confidence:
        typeof data.confidence === "number"
          ? data.confidence
          : data.confidence
            ? Number(data.confidence)
            : null,
      riskLevel: data.riskLevel || "low",
      needsUrgentCare: Boolean(data.needsUrgentCare),
      conversationId: data.conversationId || conversationId || null,
      requestId: data.requestId || Date.now().toString(),
      source: "fastapi",
      model: data.model || null,
      retrievalMode: data.retrievalMode || null,
      generationProvider: data.generationProvider || null,
      generationError: data.generationError || null,
    };
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data;
    const wrapped = new Error(
      status
        ? `RAG service responded with status ${status}`
        : error.code === "ECONNABORTED"
          ? "RAG service request timed out"
          : error.message || "RAG service request failed"
    );

    wrapped.isRagServiceError = true;
    wrapped.status = status || null;
    wrapped.detail = detail || null;
    throw wrapped;
  }
}

export async function checkRagHealth() {
  const response = await axios.get(`${getRagServiceBaseUrl()}/health`, {
    timeout: getTimeoutMs(),
  });
  return response.data;
}
