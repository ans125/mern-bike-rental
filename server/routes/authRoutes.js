/**
 * @swagger
 * /api/auth/captcha:
 *   get:
 *     summary: Get a new human-verification question for the signup form
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: "{ question, token }"
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a customer or provider (KYC documents required)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [role, name, email, phone, password, cnic, city, address, cnicFront, cnicBack, captchaToken, captchaAnswer]
 *             properties:
 *               role: { type: string, enum: [user, provider] }
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string, example: "0300-1234567" }
 *               password: { type: string, description: "8+ characters, letters and numbers" }
 *               cnic: { type: string, example: "35202-1234567-1" }
 *               city: { type: string }
 *               address: { type: string, description: "Home address (customer) or pick-up shop address (provider)" }
 *               licenseNumber: { type: string, description: "Required for customers" }
 *               shopName: { type: string, description: "Required for providers" }
 *               cnicFront: { type: string, format: binary }
 *               cnicBack: { type: string, format: binary }
 *               captchaToken: { type: string }
 *               captchaAnswer: { type: string }
 *     responses:
 *       201:
 *         description: Account created, waiting for admin verification
 *       400:
 *         description: Validation, captcha or duplicate error
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the logged in user's current profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 */
import express from "express";
import { registerUser, loginUser, getMe, getCaptcha } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { kycUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/captcha", getCaptcha);
router.post(
  "/register",
  kycUpload.fields([{ name: "cnicFront", maxCount: 1 }, { name: "cnicBack", maxCount: 1 }]),
  registerUser
);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
