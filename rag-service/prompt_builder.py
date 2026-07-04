def build_prompt(question, documents):
    """Build a grounded prompt for medical Q&A from retrieved documents."""
    if not documents:
        return f"""
You are PharmaHub Medical Assistant.
You are a helpful medical information assistant.
Use only the provided context below.
Do not diagnose, prescribe, or change treatment.
If the answer is not clearly supported by the context, say that clearly.
If the user mentions urgent symptoms or emergency signs, advise immediate medical care.

User question:
{question}

Context:
No relevant medical context was found.

Answer briefly and safely.
""".strip()

    context_blocks = []
    for i, doc in enumerate(documents, start=1):
        name = doc.get("name", "Unknown")
        text = doc.get("text", "")
        context_blocks.append(f"Source {i}: {name}\n{text}")

    context_text = "\n\n".join(context_blocks)

    return f"""
You are PharmaHub Medical Assistant.
You are a helpful medical information assistant.
Use the retrieved context as your source of truth, but answer in your own words.
Do not copy the context word-for-word.
Do not diagnose medical conditions, prescribe medication, or recommend dosage changes.
Do not invent facts.
If the context is weak or incomplete, say so clearly.
If the question is about urgent symptoms such as chest pain, trouble breathing, stroke symptoms, severe allergic reaction, loss of consciousness, seizure, heavy bleeding, or suicidal thoughts, advise immediate emergency medical help.
Answer in a short, clear, natural, and safe way.
You may paraphrase and structure the answer differently each time, as long as it stays grounded in the context.
Cite the relevant source by name when possible.

User question:
{question}

Retrieved context:
{context_text}

Answer:
""".strip()


if __name__ == "__main__":
    sample_docs = [
        {
            "name": "Dolo 650",
            "text": "Used for fever and mild pain. Take one tablet every 6 hours if needed."
        },
        {
            "name": "Ibuprofen",
            "text": "Used for pain relief and inflammation. Take after food. Avoid if you have stomach ulcers."
        }
    ]
    prompt = build_prompt("What is ibuprofen used for?", sample_docs)
    print(prompt)
