from sentence_transformers import SentenceTransformer

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def generate_embedding(text):
    embedding = model.encode(text)
    return embedding.tolist()


if __name__ == "__main__":
    sample = """
    Name: Dolo 650

    Uses:
    Used for fever and pain.
    """

    embedding = generate_embedding(sample)
    

    print("Dimensions:", len(embedding))
    print("First 5 values:")
    print(embedding[:5])