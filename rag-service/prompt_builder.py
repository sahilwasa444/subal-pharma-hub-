def build_prompt(question, documents):
    """Build a grounded prompt for medical Q&A from retrieved documents."""
    if not documents:
        return f"""
You are PharmaHub Medical Assistant.
You are a helpful medical information assistant.
If there is no relevant local context, give a short general educational answer when the question is about a common low-risk topic such as vitamins, supplements, nutrition, or basic medicine usage.
Clearly say that the answer is general information and not from the local knowledge base.
Do not diagnose, prescribe, or change treatment.
If the question asks for an exact dose, diagnosis, interaction, pregnancy advice, child advice, or a high-risk symptom, do not guess and advise a pharmacist or clinician.
If the user uses a short or informal medicine name, map it to the closest medicine in the context when the match is obvious.
If the user mentions urgent symptoms or emergency signs, advise immediate medical care.

User question:
{question}

Context:
No relevant medical context was found.

Answer briefly, safely, and helpfully.
""".strip()

    context_blocks = []
    for i, doc in enumerate(documents, start=1):
        name = doc.get("name", "Unknown")
        source = doc.get("source", "Unknown source")
        page = doc.get("page")
        snippet = doc.get("snippet") or (doc.get("text", "")[:400].strip())

        context_blocks.append(
            f"Source {i}: {name}\n"
            f"Origin: {source}"
            + (f"\nPage: {page}" if page is not None else "")
            + f"\nRelevant snippet: {snippet}"
        )

    context_text = "\n\n".join(context_blocks)

    return f"""
You are PharmaHub Medical Assistant.
You are a helpful medical information assistant.
Use the retrieved context as your source of truth, but answer in your own words.
Do not copy the context word-for-word.
Do not diagnose medical conditions, prescribe medication, or recommend dosage changes.
Do not invent facts.
If the context is weak or incomplete, say so clearly, but still give a useful general answer when the question is about a common low-risk topic like vitamins or basic medicine usage.
If a medicine is identified in the retrieved context, answer about that medicine even if the user asked using a shorter variant like "tablet", "capsule", or a partial brand name.
If the question is about urgent symptoms such as chest pain, trouble breathing, stroke symptoms, severe allergic reaction, loss of consciousness, seizure, heavy bleeding, or suicidal thoughts, advise immediate emergency medical help.
Answer in a short, clear, natural, and safe way.
You may paraphrase and structure the answer differently each time, as long as it stays grounded in the context when context exists. When context is missing, give a general answer and clearly label it as general information.
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
