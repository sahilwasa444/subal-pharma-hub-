import express from "express";
import { chat } from "../controllers/medicalAssistantController.js";
import { checkRagHealth } from "../services/ragClient.js";

const router = express.Router();

router.get("/health", async (_req, res) => {
  try {
    const ragHealth = await checkRagHealth();
    return res.json({
      backend: "ok",
      ragService: {
        status: "ok",
        details: ragHealth,
      },
    });
  } catch (error) {
    return res.status(503).json({
      backend: "ok",
      ragService: {
        status: "down",
        error: error.message,
      },
    });
  }
});

// POST /api/medical-assistant/chat
router.post("/chat", chat);

export default router;
