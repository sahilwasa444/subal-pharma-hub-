import crypto from "crypto";
import { redisClient } from "../config/redis.js";
import { askRagService } from "../services/ragClient.js";
import { checkSafety } from "../services/rag/safety.js";
import { composeMedicalReply } from "../services/rag/retrieval.js";

// Medical assistant controller with safety triage and Redis cache.
const CACHE_VERSION = "v2";

export async function chat(req, res) {
  try {
    const { message, conversationId = null, locale = "en-US" } = req.body;
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
    const cacheKey = `medassist:${CACHE_VERSION}:${hash}`;

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

    let retrieval;
    try {
      retrieval = await askRagService({
        message: normalized,
        conversationId,
        locale,
      });
    } catch (ragErr) {
      console.warn(
        "FastAPI RAG request failed, using local fallback:",
        ragErr.message
      );
      const fallback = composeMedicalReply(normalized);
      retrieval = {
        ...fallback,
        confidence: fallback.citations.length ? 0.45 : 0.25,
        conversationId,
        requestId: Date.now().toString(),
        source: "local-fallback",
        retrievalMode: "local-fallback",
        generationError: ragErr.message,
      };
    }

    const responsePayload = {
      answer: retrieval.answer,
      citations: retrieval.citations,
      confidence: retrieval.confidence ?? null,
      riskLevel: retrieval.riskLevel,
      needsUrgentCare: retrieval.needsUrgentCare,
      conversationId: retrieval.conversationId || conversationId,
      requestId: retrieval.requestId || Date.now().toString(),
      source: retrieval.source || "fastapi",
      retrievalMode: retrieval.retrievalMode || null,
      generationProvider: retrieval.generationProvider || null,
      generationError: retrieval.generationError || null,
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

