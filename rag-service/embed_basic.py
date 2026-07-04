import re


def build_simple_embedding(text):
    tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    vocabulary = sorted(set(tokens))
    vector = [0] * len(vocabulary)

    for token in tokens:
        index = vocabulary.index(token)
        vector[index] += 1

    return vector


def generate_embedding(text):
    return build_simple_embedding(text)


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
