import hashlib
import math
import os
import re


EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "384"))


def _tokenize(text):
    return re.findall(r"[a-z0-9]+", (text or "").lower())


def _accumulate(vector, token, weight=1.0):
    digest = hashlib.sha256(token.encode("utf-8")).digest()
    index = int.from_bytes(digest[:4], "big") % len(vector)
    sign = 1.0 if digest[4] % 2 == 0 else -1.0
    vector[index] += sign * weight


def generate_embedding(text):
    tokens = _tokenize(text)
    vector = [0.0] * EMBEDDING_DIMENSIONS

    if not tokens:
        return vector

    for index, token in enumerate(tokens):
        _accumulate(vector, token, 1.0)

        if index + 1 < len(tokens):
            bigram = f"{token}_{tokens[index + 1]}"
            _accumulate(vector, bigram, 0.75)

    norm = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [round(value / norm, 6) for value in vector]


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
