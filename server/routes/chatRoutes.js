/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Ask the RideRent AI customer support assistant
 *     tags: [Chat]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               history:
 *                 type: array
 *                 description: Previous turns [{ sender "user"|"bot", text }]
 *     responses:
 *       200:
 *         description: Assistant reply in { reply }
 */
import express from "express";
import { askAssistant } from "../controllers/chatController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", optionalAuth, askAssistant);

export default router;
