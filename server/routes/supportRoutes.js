/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Send a customer support message (Contact page)
 *     tags: [Support]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message saved
 */
import express from "express";
import { createSupportMessage } from "../controllers/supportController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", optionalAuth, createSupportMessage);

export default router;
