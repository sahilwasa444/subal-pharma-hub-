def chunk_text(text, chunk_size=800, overlap=120):
    if not text or not text.strip():
        return []

    cleaned = " ".join(text.split())
    words = cleaned.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        if not chunk_words:
            break

        chunk_text = " ".join(chunk_words)
        chunks.append(chunk_text)
        start += chunk_size - overlap

    return chunks
