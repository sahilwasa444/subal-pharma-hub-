import os
import uuid
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from generator import generate_answer
from prompt_builder import build_prompt
from retrieval import retrieve


EMERGENCY_KEYWORDS = [
    "chest pain",
    "difficulty breathing",
    "trouble breathing",
    "shortness of breath",
    "stroke",
    "seizure",
    "heavy bleeding",
    "unconscious",
    "loss of consciousness",
    "suicidal",
    "allergic reaction",
]

EMERGENCY_MESSAGE = (
    "Your symptoms may indicate a medical emergency. "
    "Please seek immediate medical care or contact your local emergency services. "
    "PharmaHub Medical Assistant cannot provide emergency medical advice."
)

app = FastAPI(title="PharmaHub RAG Service", version="0.1.0")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversationId: Optional[str] = None
    locale: Optional[str] = "en-US"


class Citation(BaseModel):
    title: str
    sourceId: Optional[str] = None
    chunkId: Optional[str] = None
    snippet: Optional[str] = None
    page: Optional[int] = None


class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    confidence: float
    riskLevel: str
    needsUrgentCare: bool
    conversationId: str
    requestId: str
    model: Optional[str] = None
    retrievalMode: Optional[str] = None
    generationProvider: Optional[str] = None
    generationError: Optional[str] = None


def normalize_message(message):
    return " ".join(message.strip().split())


def has_emergency_keyword(message):
    lowered = message.lower()
    return any(keyword in lowered for keyword in EMERGENCY_KEYWORDS)


def build_citations(documents):
    citations = []
    for doc in documents:
        source = doc.get("source") or doc.get("name") or "medical-chunk"
        chunk_id = doc.get("chunk_id")
        snippet = doc.get("snippet") or doc.get("text", "")[:240].strip()

        citations.append(
            {
                "title": doc.get("name") or source,
                "sourceId": f"{source}-{chunk_id}" if chunk_id is not None else source,
                "chunkId": str(chunk_id) if chunk_id is not None else None,
                "snippet": snippet or None,
                "page": doc.get("page"),
            }
        )

    return citations


def estimate_confidence(documents, provider="fallback", urgent=False):
    if urgent:
        return 0.99

    if not documents:
        return 0.28 if provider == "fallback" else 0.35

    top_score = max(0, int(documents[0].get("score") or 0))
    confidence = 0.42 + min(0.4, top_score * 0.09)
    confidence += min(0.08, max(0, len(documents) - 1) * 0.03)

    if provider == "fallback":
        confidence -= 0.05

    return round(max(0.2, min(confidence, 0.99)), 2)


def determine_risk_level(confidence, urgent=False):
    if urgent:
        return "high"
    if confidence < 0.55:
        return "medium"
    return "low"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "pharmahub-rag",
        "mongoConfigured": bool(os.getenv("MONGO_URI")),
        "geminiConfigured": bool(os.getenv("GEMINI_API_KEY")),
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    message = normalize_message(request.message)
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    conversation_id = request.conversationId or uuid.uuid4().hex
    request_id = uuid.uuid4().hex

    if has_emergency_keyword(message):
        return ChatResponse(
            answer=EMERGENCY_MESSAGE,
            citations=[],
            confidence=0.99,
            riskLevel="high",
            needsUrgentCare=True,
            conversationId=conversation_id,
            requestId=request_id,
        )

    try:
        documents = retrieve(message, limit=3)
    except Exception as exc:
        print(f"Retrieval failed, continuing with an empty context: {exc}")
        documents = []

    prompt = build_prompt(message, documents)
    generation = generate_answer(prompt, question=message, documents=documents)
    answer = (generation.get("answer") or "").strip()
    provider = generation.get("provider", "fallback")

    if not answer:
        answer = (
            "I could not produce a grounded answer from the current medical knowledge base. "
            "Please consult a pharmacist or clinician."
        )

    confidence = estimate_confidence(documents, provider=provider, urgent=False)
    risk_level = determine_risk_level(confidence, urgent=False)

    if provider == "fallback" and confidence < 0.55 and documents:
        answer = (
            f"{answer} "
            "The retrieved context is limited, so please verify this with a pharmacist or clinician."
        ).strip()

    return ChatResponse(
        answer=answer,
        citations=build_citations(documents),
        confidence=confidence,
        riskLevel=risk_level,
        needsUrgentCare=False,
        conversationId=conversation_id,
        requestId=request_id,
        model=generation.get("model"),
        retrievalMode=documents[0].get("retrieval_mode") if documents else None,
        generationProvider=generation.get("provider"),
        generationError=generation.get("error"),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("RAG_SERVICE_PORT", "8000")),
        reload=os.getenv("RAG_SERVICE_RELOAD", "false").lower() == "true",
    )
