/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */
/**
 * @swagger
 * /api/admin/providers/pending:
 *   get:
 *     summary: Get providers waiting approval
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending providers
 */
/**
 * @swagger
 * /api/admin/providers/{id}/approve:
 *   put:
 *     summary: Approve provider
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider approved
 */
/**
 * @swagger
 * /api/admin/bikes:
 *   get:
 *     summary: Admin get all bikes
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/admin/bikes/{id}:
 *   delete:
 *     summary: Delete bike
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Admin get all bookings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
import express from "express";
// import { approveProvider } from "../controllers/adminController.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  getPendingProviders,
  approveProvider,
  getAllBikes,
  deleteBike,
  getAllBookings,
  getAdminStats
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/providers/pending", protect, adminOnly, getPendingProviders);

router.put("/providers/:id/approve", protect, adminOnly, approveProvider);

router.get("/bikes", protect, adminOnly, getAllBikes);

router.delete("/bikes/:id", protect, adminOnly, deleteBike);

router.get("/bookings", protect, adminOnly, getAllBookings);

router.get("/stats", protect, adminOnly, getAdminStats);

export default router;