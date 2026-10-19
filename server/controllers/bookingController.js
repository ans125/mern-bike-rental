import Booking from "../models/Booking.js";
import Bike from "../models/bikeModel.js";


const DAY_MS = 1000 * 60 * 60 * 24;

// USER - Create Booking
export const createBooking = async (req, res) => {
  try {
    const { bikeId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Valid start and end dates are required" });
    }

    if (end < start) {
      return res.status(400).json({ message: "End date cannot be earlier than start date" });
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    // Check overlapping bookings
    const existingBooking = await Booking.findOne({
      bike: bikeId,
      status: { $ne: "cancelled" },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Bike already booked for these dates",
      });
    }

    // Same-day rental counts as one day, matching the price shown on the bike page
    const days = Math.max(1, Math.ceil((end - start) / DAY_MS));
    const totalPrice = days * bike.rentPerDay;

    const booking = await Booking.create({
      bike: bike._id,
      user: req.user._id,
      provider: bike.provider,
      startDate: start,
      endDate: end,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER - View My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("bike")
      .populate("provider", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PROVIDER - View bookings for their bikes
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("bike")
      .populate("user", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ADMIN - View all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bike")
      .populate("user", "name email")
      .populate("provider", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// USER / PROVIDER / ADMIN - Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const userId = req.user._id.toString();
    const canCancel =
      booking.user.toString() === userId ||
      booking.provider.toString() === userId ||
      req.user.role === "admin";

    if (!canCancel) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};