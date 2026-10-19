import User from "../models/User.js";
import Bike from "../models/bikeModel.js";
import Booking from "../models/Booking.js";

/* GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET PROVIDERS WAITING APPROVAL */
export const getPendingProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
      isApproved: false
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* APPROVE PROVIDER */
export const approveProvider = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    provider.isApproved = true;
    await provider.save();
    res.json({ message: "Provider approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL BIKES */
export const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({}).populate("provider", "name email");
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
      .populate("user", "name email")
      .populate("bike", "name brand");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN DASHBOARD STATS */
export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const providers = await User.countDocuments({ role: "provider" });
    const bikes = await Bike.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({
      users,
      providers,
      bikes,
      bookings,
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
    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};