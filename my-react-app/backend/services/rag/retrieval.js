import medicineKnowledge from "./medicineKnowledge.js";

const stopWords = new Set([
  "a",
  "an",
  "the",
  "for",
  "with",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "by",
  "as",
  "is",
  "are",
  "be",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "from",
  "can",
  "may"
]);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((word) => word && !stopWords.has(word));
}

function buildCandidate(item) {
  const text = [
    item.name,
    item.uses,
    item.dosage,
    item.sideEffects.join(", "),
    item.warnings.join(", ")
  ].join(" \n ");

  return {
    id: item.id,
    name: item.name,
    summary: text,
    tokens: new Set(tokenize(text)),
    uses: item.uses,
    dosage: item.dosage,
    sideEffects: item.sideEffects,
    warnings: item.warnings
  };
}

const candidates = medicineKnowledge.map(buildCandidate);

function scoreCandidate(questionTokens, candidate) {
  let score = 0;
  for (const token of questionTokens) {
    if (candidate.tokens.has(token)) {
      score += 1;
    }
  }

  const normalizedName = normalize(candidate.name);
  if (questionTokens.has(normalizedName)) {
    score += 4;
  }

  return score;
}

function makeSnippet(candidate, questionTokens) {
  const lines = candidate.summary.split("\n");
  const ranked = lines
    .map((line) => {
      const lineTokens = new Set(tokenize(line));
      let lineScore = 0;
      for (const token of questionTokens) {
        if (lineTokens.has(token)) {
          lineScore += 1;
        }
      }
      return { line: line.trim(), lineScore };
    })
    .sort((a, b) => b.lineScore - a.lineScore);

  return ranked[0]?.line || candidate.summary.slice(0, 120).trim();
}

export function retrieveMedicalEvidence(question, limit = 3) {
  const questionTokens = new Set(tokenize(question));

  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(questionTokens, candidate),
      snippet: makeSnippet(candidate, questionTokens)
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);

  return scored;
}

export function composeMedicalReply(question) {
  const evidence = retrieveMedicalEvidence(question, 3);
  const answerPrefix =
    "This information comes from the local medicine knowledge base. " +
    "Use it for general guidance only and consult a pharmacist or clinician for personal advice.";

  if (!evidence.length) {
    return {
      answer:
        answerPrefix +
        " I couldn’t find a close match for that question. Please ask about a specific medicine or symptom, or consult a healthcare professional.",
      citations: [],
      riskLevel: "low",
      needsUrgentCare: false
    };
  }

  const primary = evidence[0];
  const questionNormalized = normalize(question);
  const wantsDosage = questionNormalized.includes("dosage") || questionNormalized.includes("dose") || questionNormalized.includes("take");
  const wantsEffects = questionNormalized.includes("side effect") || questionNormalized.includes("side effects") || questionNormalized.includes("adverse");
  const wantsWarnings = questionNormalized.includes("warning") || questionNormalized.includes("avoid") || questionNormalized.includes("risk") || questionNormalized.includes("caution");

  const pieces = [];
  pieces.push(`${primary.name} is generally used for ${primary.uses.toLowerCase()}`);

  if (wantsDosage) {
    pieces.push(`Recommended guidance: ${primary.dosage}`);
  }

  if (wantsEffects && primary.sideEffects.length) {
    pieces.push(`Possible side effects include ${primary.sideEffects.join(", ")}`);
  }

  if (wantsWarnings && primary.warnings.length) {
    pieces.push(`Key warnings: ${primary.warnings.join("; ")}`);
  }

  if (!wantsDosage && !wantsEffects && !wantsWarnings) {
    pieces.push(`Take it as directed and pay attention to the warnings: ${primary.warnings.join("; ")}.`);
  }

  const answer = [answerPrefix, pieces.join(". ") + "."]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const citations = evidence.map((item) => ({
    title: item.name,
    snippet: item.snippet,
    sourceId: `medicine-${item.id}`
  }));

  return {
    answer,
    citations,
    riskLevel: "low",
    needsUrgentCare: false
  };
}
