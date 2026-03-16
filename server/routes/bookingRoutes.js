/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a bike
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Booking created
 */
/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Get logged in user bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings list
 */
import express from "express";

import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getAllBookings,
  cancelBooking
} from "../controllers/bookingController.js";

import { protect, adminOnly, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/provider", protect, providerOnly, getProviderBookings);

router.get("/admin", protect, adminOnly, getAllBookings);

router.put("/cancel/:id", protect, cancelBooking);

export default router;