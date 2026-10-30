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
/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Provider approves or rejects a pending booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Booking updated
 */
/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Booking details for the renter, the bike owner or admin (contacts shared after approval)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/bookings/{id}/messages:
 *   post:
 *     summary: Send a chat message between renter and owner (after approval)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/bookings/{id}/pickup:
 *   put:
 *     summary: Owner confirms the bike was handed over (starts the ride)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/bookings/{id}/return:
 *   put:
 *     summary: Owner confirms the bike was returned (completes the booking)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
import express from "express";

import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
  getBookingDetails,
  addBookingMessage,
  confirmPickup,
  confirmReturn
} from "../controllers/bookingController.js";

import { protect, adminOnly, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/provider", protect, providerOnly, getProviderBookings);

router.get("/admin", protect, adminOnly, getAllBookings);

router.put("/cancel/:id", protect, cancelBooking);

router.put("/:id/status", protect, updateBookingStatus);

router.put("/:id/pickup", protect, providerOnly, confirmPickup);

router.put("/:id/return", protect, providerOnly, confirmReturn);

router.post("/:id/messages", protect, addBookingMessage);

router.get("/:id", protect, getBookingDetails);

export default router;