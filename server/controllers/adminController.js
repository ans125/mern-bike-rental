import fs from "fs";
import User from "../models/User.js";
import Bike from "../models/bikeModel.js";
import Booking from "../models/Booking.js";
import SupportMessage from "../models/SupportMessage.js";
import { kycFilePath } from "./authController.js";
import { EARNING_STATUSES } from "./bookingController.js";

/* GET ALL USERS (never sends password hashes) */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ACCOUNTS FOR VERIFICATION: ?status=pending|approved|rejected (customers and providers) */
export const getVerifications = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const filter = { role: { $in: ["user", "provider"] } };

    if (status === "approved") filter.isApproved = true;
    else if (status === "rejected") Object.assign(filter, { isApproved: false, verificationStatus: "rejected" });
    else Object.assign(filter, { isApproved: false, verificationStatus: { $ne: "rejected" } });

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* APPROVE ACCOUNT after checking the CNIC */
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isApproved = true;
    user.verificationStatus = "approved";
    user.verificationNote = "";
    await user.save();
    res.json({ message: `${user.name} approved` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REJECT ACCOUNT with a reason the user will see */
export const rejectUser = async (req, res) => {
  try {
    const reason = req.body.reason?.trim();
    if (!reason) {
      return res.status(400).json({ message: "Please give a reason for rejection" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot be rejected" });
    }
    user.isApproved = false;
    user.verificationStatus = "rejected";
    user.verificationNote = reason.slice(0, 500);
    await user.save();
    res.json({ message: `${user.name} rejected` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* VIEW A CNIC IMAGE (admin only; documents are not public files) */
export const getUserDocument = async (req, res) => {
  try {
    const { side } = req.params;
    if (!["cnicFront", "cnicBack"].includes(side)) {
      return res.status(400).json({ message: "Unknown document" });
    }
    const user = await User.findById(req.params.id).select("documents");
    const fileName = user?.documents?.[side];
    const filePath = kycFilePath(fileName);
    if (!fileName || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.set("Cache-Control", "private, no-store");
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL BIKES */
export const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({}).populate("provider", "name email").sort({ createdAt: -1 });
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE BIKE */
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    await bike.deleteOne();
    res.json({ message: "Bike removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL BOOKINGS */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .select("-messages")
      .populate("user", "name email")
      .populate("provider", "name email")
      .populate("bike", "name brand")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN DASHBOARD STATS + CHART DATA */
export const getAdminStats = async (req, res) => {
  try {
    // First day of the month, 5 months ago -> last 6 months including this one
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [users, providers, pendingVerifications, bikes, bookings, openMessages, earnings, monthly, byStatus] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "provider" }),
        User.countDocuments({ role: { $in: ["user", "provider"] }, isApproved: false, verificationStatus: { $ne: "rejected" } }),
        Bike.countDocuments(),
        Booking.countDocuments(),
        SupportMessage.countDocuments({ status: "open" }),
        // Money counts only bookings the provider accepted (approved, on ride or completed)
        Booking.aggregate([
          { $match: { status: { $in: EARNING_STATUSES } } },
          { $group: { _id: null, revenue: { $sum: "$totalPrice" }, platformEarnings: { $sum: "$commission" } } },
        ]),
        // Revenue and commission per month of the rental start date
        Booking.aggregate([
          { $match: { status: { $in: EARNING_STATUSES }, startDate: { $gte: since } } },
          {
            $group: {
              _id: { y: { $year: "$startDate" }, m: { $month: "$startDate" } },
              revenue: { $sum: "$totalPrice" },
              platformEarnings: { $sum: "$commission" },
              bookings: { $sum: 1 },
            },
          },
        ]),
        Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);

    // Fill months with no bookings so the chart always shows 6 bars
    const months = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(since.getFullYear(), since.getMonth() + i, 1);
      const row = monthly.find((m) => m._id.y === d.getFullYear() && m._id.m === d.getMonth() + 1);
      months.push({
        month: d.toLocaleString("en-US", { month: "short", year: "2-digit" }),
        revenue: row?.revenue || 0,
        platformEarnings: row?.platformEarnings || 0,
        bookings: row?.bookings || 0,
      });
    }

    const statusOrder = ["pending", "approved", "ongoing", "completed", "rejected", "cancelled"];
    const bookingsByStatus = statusOrder.map((status) => ({
      status,
      count: byStatus.find((s) => s._id === status)?.count || 0,
    }));

    res.json({
      users,
      providers,
      pendingVerifications,
      bikes,
      bookings,
      openMessages,
      revenue: earnings[0]?.revenue || 0,
      platformEarnings: earnings[0]?.platformEarnings || 0,
      monthly: months,
      bookingsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot be deleted" });
    }
    // Remove a provider's listings so no orphaned bikes stay bookable
    if (user.role === "provider") {
      await Bike.deleteMany({ provider: user._id });
    }
    // Remove identity documents from disk (shared demo samples are kept)
    Object.values(user.documents || {}).forEach((f) => f && !f.startsWith("demo-") && fs.unlink(kycFilePath(f), () => {}));
    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
