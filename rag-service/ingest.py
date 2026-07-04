from pathlib import Path
from embed import generate_embedding
from config import medicine_collection
from pdf_loader import extract_text
from chunker import chunk_text

ROOT = Path(__file__).resolve().parent
PDF_PATH = ROOT / "data" / "product_catalog.pdf"


def ingest_pdf(pdf_path=PDF_PATH):
    text = extract_text(pdf_path)
    chunks = chunk_text(text)

    if not chunks:
        raise ValueError("No text extracted from PDF")

    medicine_collection.delete_many({"source": pdf_path.name})

    inserted_documents = []
    for chunk_id, chunk in enumerate(chunks, start=1):
        embedding = generate_embedding(chunk)
        record = {
            "source": pdf_path.name,
            "chunk_id": chunk_id,
            "text": chunk,
            "embedding": embedding,
        }
        medicine_collection.insert_one(record)
        inserted_documents.append(record)

    return inserted_documents


if __name__ == "__main__":
    try:
        docs = ingest_pdf()
        print(f"Inserted {len(docs)} chunks from {PDF_PATH.name}")
    except Exception as exc:
        print(f"Ingestion failed: {exc}")
