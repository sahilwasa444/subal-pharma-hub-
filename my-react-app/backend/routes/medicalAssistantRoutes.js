import express from "express";
import { chat } from "../controllers/medicalAssistantController.js";

const router = express.Router();

// POST /api/medical-assistant/chat
router.post("/chat", chat);

export default router;
