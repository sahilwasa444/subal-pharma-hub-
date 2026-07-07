import re

from embed import generate_embedding
from config import medicine_collection


def _normalize(text):
    return re.sub(r"[^a-z0-9\s]", " ", text.lower()).replace("\n", " ").strip()


def _question_terms(question):
    normalized = _normalize(question)
    return [term for term in normalized.split() if len(term) > 2]


def _score_document(question, document):
    q = question.lower()
    terms = _question_terms(question)
    text = f"{document.get('source', '')} {document.get('text', '')}".lower()

    score = 0
    if q in text:
        score += 2

    for term in terms:
        if term in text:
            score += 1

    return score, terms


def _build_snippet(document, terms):
    text = document.get("text", "") or ""
    source = document.get("source", "") or ""
    candidates = [line.strip() for line in text.splitlines() if line.strip()]
    if source:
        candidates.insert(0, source.strip())

    if not candidates:
        return text[:240].strip()

    ranked = sorted(
        candidates,
        key=lambda line: sum(1 for term in terms if term in line.lower()),
        reverse=True,
    )
    return ranked[0][:240].strip()


def _fetch_keyword_documents(question, limit):
    q = question.lower()
    search_terms = [term for term in q.split() if len(term) > 2]
    if not search_terms:
        return []

    query = {"$or": []}
    for term in search_terms:
        query["$or"].append({"text": {"$regex": term, "$options": "i"}})
        query["$or"].append({"source": {"$regex": term, "$options": "i"}})

    if not query["$or"]:
        return []

    return list(
        medicine_collection.find(
            query,
            {"_id": 0, "text": 1, "source": 1, "chunk_id": 1, "page": 1, "name": 1},
        ).limit(limit)
    )


def _merge_documents(primary_docs, secondary_docs):
    merged = []
    seen = set()

    for doc in list(primary_docs) + list(secondary_docs):
        key = (
            doc.get("source"),
            str(doc.get("chunk_id")),
            doc.get("text", "")[:120],
        )
        if key in seen:
            continue
        seen.add(key)
        merged.append(doc)

    return merged


def retrieve(question, limit=3):
    query_embedding = generate_embedding(question)
    documents = []
    retrieval_mode = "vector"
    keyword_documents = []

    try:
        results = medicine_collection.aggregate(
            [
                {
                    "$vectorSearch": {
                        "index": "autoembed_index",
                        "path": "embedding",
                        "queryVector": query_embedding,
                        "numCandidates": 50,
                        "limit": limit,
                    }
                }
            ]
        )
        documents = list(results)
    except Exception as exc:
        print(f"Vector search unavailable, using keyword fallback: {exc}")

    try:
        keyword_documents = _fetch_keyword_documents(question, limit)
    except Exception as exc:
        print(f"Keyword retrieval failed: {exc}")

    if documents and keyword_documents:
        retrieval_mode = "hybrid"
    elif keyword_documents:
        retrieval_mode = "keyword"
    elif not documents:
        retrieval_mode = "keyword"

    documents = _merge_documents(documents, keyword_documents)

    scored_docs = []
    for doc in documents:
        score, terms = _score_document(question, doc)
        if retrieval_mode == "vector" and score == 0:
            score = 1
        scored_docs.append(
            {
                "name": doc.get("name") or doc.get("source") or "medical-chunk",
                "source": doc.get("source"),
                "chunk_id": doc.get("chunk_id"),
                "page": doc.get("page"),
                "text": doc.get("text", ""),
                "score": score,
                "snippet": _build_snippet(doc, terms),
                "retrieval_mode": retrieval_mode,
            }
        )

    scored_docs.sort(key=lambda item: item["score"], reverse=True)
    return scored_docs[:limit]


if __name__ == "__main__":
    docs = retrieve("Medicine for fever")

    for doc in docs:
        label = doc.get("name") or doc.get("source") or "chunk"
        print(label)
