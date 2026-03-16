/**
 * @swagger
 * /api/bikes:
 *   get:
 *     summary: Get all bikes
 *     tags: [Bikes]
 *     responses:
 *       200:
 *         description: List of bikes
 */
/**
 * @swagger
 * /api/bikes/{id}:
 *   get:
 *     summary: Get bike details
 *     tags: [Bikes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bike details
 */
/**
 * @swagger
 * /api/bikes:
 *   post:
 *     summary: Provider adds a bike
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Bike created
 */
/**
 * @swagger
 * /api/bikes/{id}/reviews:
 *   post:
 *     summary: Add review to bike
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Review added
 */
import express from "express";
import {
  addBike,
  getAllBikes,
  getBikeById,
  getMyBikes,
} from "../controllers/bikeController.js";
import { createBikeReview } from "../controllers/bikeController.js";
import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBikes);
router.post("/", protect, providerOnly, addBike);
router.get("/my/bikes", protect, providerOnly, getMyBikes);
router.get("/:id", getBikeById);
router.post("/:id/reviews", protect, createBikeReview);
export default router;