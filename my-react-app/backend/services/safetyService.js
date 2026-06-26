const emergencyKeywords = [
  "chest pain",
  "difficulty breathing",
  "trouble breathing",
  "shortness of breath",
  "stroke",
  "seizure",
  "heavy bleeding",
  "unconscious",
  "loss of consciousness",
  "suicidal",
  "allergic reaction"
];

export function checkSafety(message) {
  const text = message.toLowerCase();
  for (const keyword of emergencyKeywords) {
    if (text.includes(keyword)) {
      return {
        safe: false,
        riskLevel: "high",
        needsUrgentCare: true,
        answer:
          "Your symptoms may indicate a medical emergency. Please seek immediate medical care or contact your local emergency services. PharmaHub Medical Assistant cannot provide emergency medical advice."
      };
    }
  }

  return {
    safe: true,
    riskLevel: "low",
    needsUrgentCare: false
  };
}
