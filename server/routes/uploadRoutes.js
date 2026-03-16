/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload bike image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Image uploaded
 */
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, providerOnly, upload.single("image"), (req, res) => {
  res.send(`/uploads/${req.file.filename}`);
});

export default router;