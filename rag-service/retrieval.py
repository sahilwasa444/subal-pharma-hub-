from embed import generate_embedding
from config import medicine_collection


def retrieve(question, limit=3):
    query_embedding = generate_embedding(question)
    documents = []

    try:
        results = medicine_collection.aggregate([
            {
                "$vectorSearch": {
                    "index": "autoembed_index",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": 50,
                    "limit": limit,
                }
            }
        ])
        documents = list(results)
    except Exception as exc:
        print(f"Vector search unavailable, using keyword fallback: {exc}")

    if not documents:
        q = question.lower()
        search_terms = [term for term in q.split() if len(term) > 2]
        query = {"$or": []}
        for term in search_terms:
            query["$or"].append({"text": {"$regex": term, "$options": "i"}})
            query["$or"].append({"source": {"$regex": term, "$options": "i"}})
        if not query["$or"]:
            query = {}
        documents = list(
            medicine_collection.find(
                query,
                {"_id": 0, "text": 1, "source": 1, "chunk_id": 1},
            ).limit(limit)
        )

    q = question.lower()
    scored_docs = []
    for doc in documents:
        score = 0
        text = f"{doc.get('source', '')} {doc.get('text', '')}".lower()

        if q in text:
            score += 2
        for word in q.split():
            if word in text:
                score += 1

        scored_docs.append((score, doc))

    scored_docs.sort(key=lambda item: item[0], reverse=True)
    return [doc for _, doc in scored_docs[:limit]]


if __name__ == "__main__":
    docs = retrieve("Medicine for fever")

    for doc in docs:
        label = doc.get("name") or doc.get("source") or "chunk"
        print(label)

