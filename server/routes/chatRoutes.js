/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Ask the RideRent AI assistant
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
 *     responses:
 *       200:
 *         description: Assistant reply in { reply }
 */
import express from "express";
import { askAssistant } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", askAssistant);

export default router;
