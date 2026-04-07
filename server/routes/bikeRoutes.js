import express from "express";
import {
  addBike,
  getAllBikes,
  getBikeById,
  getMyBikes,
  deleteBike,
  updateBike,
  createBikeReview
} from "../controllers/bikeController.js";
import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBikes);
router.post("/", protect, providerOnly, addBike);
router.get("/my/bikes", protect, providerOnly, getMyBikes);
router.get("/:id", getBikeById);
router.put("/:id", protect, providerOnly, updateBike);
router.delete("/:id", protect, providerOnly, deleteBike);
router.post("/:id/reviews", protect, createBikeReview);

export default router;