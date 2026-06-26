import crypto from "crypto";
import { redisClient } from "../config/redis.js";
import { checkSafety } from "../services/rag/safety.js";

// Medical assistant controller with safety triage and Redis cache.
export async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const normalized = message.trim();

    // Safety triage: check for urgent keywords.
    const safety = checkSafety(normalized);
    if (!safety.safe) {
      return res.json({
        answer: safety.answer,
        citations: [],
        riskLevel: safety.riskLevel,
        needsUrgentCare: safety.needsUrgentCare,
        requestId: Date.now().toString(),
      });
    }

    // Build a cache key for this question
    const hash = crypto
      .createHash("sha256")
      .update(normalized.toLowerCase())
      .digest("hex");
    const cacheKey = `medassist:${hash}`;

    // Try Redis cache if available
    try {
      if (redisClient && redisClient.isReady) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          const payload = JSON.parse(cached);
          payload.cached = true;
          return res.json(payload);
        }
      }
    } catch (redisErr) {
      console.warn("Redis check failed, continuing without cache:", redisErr.message);
    }

    // Retrieval stub: placeholder for Atlas Vector Search + hybrid retrieval.
    // Replace this block with actual retrieval + grounding + LLM call.
    let answer = `Safe question received: ${message}. Next: implement retrieval layer.`;
    let citations = [];
    let riskLevel = "low";
    let needsUrgentCare = false;

    // Simple keyword hinting example (to be replaced by real retrieval):
    if (normalized.toLowerCase().includes("ibuprofen")) {
      answer =
        "Some adults can take ibuprofen for pain/fever, but check active ingredients in combination medicines and consult a pharmacist if unsure.";
      citations = [
        { title: "NHS ibuprofen guidance", url: "https://www.nhs.uk/medicines/ibuprofen/" },
      ];
      riskLevel = "low";
    }

    const responsePayload = {
      answer,
      citations,
      riskLevel,
      needsUrgentCare,
      requestId: Date.now().toString(),
    };

    // Cache the result in Redis for a short time
    try {
      if (redisClient && redisClient.isReady) {
        await redisClient.set(cacheKey, JSON.stringify(responsePayload), {
          EX: 3600,
        });
      }
    } catch (redisErr) {
      console.warn("Redis set failed, continuing:", redisErr.message);
    }

    return res.json(responsePayload);
  } catch (err) {
    console.error("medicalAssistant chat error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

