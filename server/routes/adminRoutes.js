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
 * /api/admin/verifications:
 *   get:
 *     summary: Customer and provider accounts by verification status (?status=pending|approved|rejected)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending providers
 */
/**
 * @swagger
 * /api/admin/users/{id}/approve:
 *   put:
 *     summary: Approve an account after checking the CNIC
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
/**
 * @swagger
 * /api/admin/messages:
 *   get:
 *     summary: Admin get support messages from the Contact page
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/admin/messages/{id}:
 *   put:
 *     summary: Mark a support message open or resolved
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/admin/users/{id}/reject:
 *   put:
 *     summary: Reject an account with a reason ({ reason })
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /api/admin/users/{id}/documents/{side}:
 *   get:
 *     summary: View a CNIC image (side = cnicFront | cnicBack); admin only
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
import express from "express";
// import { approveProvider } from "../controllers/adminController.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  getVerifications,
  approveUser,
  rejectUser,
  getUserDocument,
  getAllBikes,
  deleteBike,
  getAllBookings,
  getAdminStats,
  deleteUser
} from "../controllers/adminController.js";
import { getSupportMessages, updateSupportMessageStatus } from "../controllers/supportController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

router.get("/verifications", protect, adminOnly, getVerifications);

router.put("/users/:id/approve", protect, adminOnly, approveUser);

router.put("/users/:id/reject", protect, adminOnly, rejectUser);

router.get("/users/:id/documents/:side", protect, adminOnly, getUserDocument);

router.get("/bikes", protect, adminOnly, getAllBikes);

router.delete("/bikes/:id", protect, adminOnly, deleteBike);

router.get("/bookings", protect, adminOnly, getAllBookings);

router.get("/stats", protect, adminOnly, getAdminStats);

router.get("/messages", protect, adminOnly, getSupportMessages);

router.put("/messages/:id", protect, adminOnly, updateSupportMessageStatus);

export default router;