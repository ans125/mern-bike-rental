import Booking from "../models/Booking.js";
import Bike from "../models/bikeModel.js";

const DAY_MS = 1000 * 60 * 60 * 24;
const MAX_RENTAL_DAYS = 30;

// Platform commission, 10% by default (can be changed with COMMISSION_RATE in .env)
const COMMISSION_RATE = Number(process.env.COMMISSION_RATE) || 0.1;

// Bookings with these statuses still hold the bike's dates
export const ACTIVE_STATUSES = ["pending", "approved", "ongoing"];
// Bookings with these statuses count as revenue / earnings
export const EARNING_STATUSES = ["approved", "ongoing", "completed"];
// After approval the two parties can see each other's contact details and chat
const CONTACT_STATUSES = ["approved", "ongoing", "completed"];

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));
const isParty = (booking, userId) =>
  [String(booking.user?._id || booking.user), String(booking.provider?._id || booking.provider)].includes(String(userId));

// USER - Create Booking
export const createBooking = async (req, res) => {
  try {
    const { bikeId, startDate, endDate } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only customer accounts can book bikes" });
    }
    if (!req.user.isApproved) {
      return res.status(403).json({ message: "Your account is waiting for CNIC verification by the admin" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Valid start and end dates are required" });
    }
    if (start < startOfToday()) {
      return res.status(400).json({ message: "Pick-up date cannot be in the past" });
    }
    if (end < start) {
      return res.status(400).json({ message: "End date cannot be earlier than start date" });
    }

    // Same-day rental counts as one day, matching the price shown on the bike page
    const days = Math.max(1, Math.ceil((end - start) / DAY_MS));
    if (days > MAX_RENTAL_DAYS) {
      return res.status(400).json({ message: `Bikes can be booked for at most ${MAX_RENTAL_DAYS} days at a time` });
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    if (bike.isAvailable === false) {
      return res.status(400).json({ message: "This bike is currently not available for rent" });
    }

    const existingBooking = await Booking.findOne({
      bike: bikeId,
      status: { $in: ACTIVE_STATUSES },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Bike already booked for these dates" });
    }

    const totalPrice = days * bike.rentPerDay;
    const commission = Math.round(totalPrice * COMMISSION_RATE);

    const booking = await Booking.create({
      bike: bike._id,
      user: req.user._id,
      provider: bike.provider,
      startDate: start,
      endDate: end,
      totalPrice,
      commission,
      providerEarning: totalPrice - commission,
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
      .select("-messages")
      .populate("bike", "name brand image city category")
      .populate("provider", "name shopName city")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER - View bookings for their bikes
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .select("-messages")
      .populate("bike", "name brand image city category")
      .populate("user", "name city")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - View all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .select("-messages")
      .populate("bike", "name brand")
      .populate("user", "name email")
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RENTER / PROVIDER / ADMIN - One booking with contact details and chat
export const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("bike", "name brand image city category rentPerDay")
      .populate("user", "name email phone city address licenseNumber")
      .populate("provider", "name email phone city address shopName");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isAdmin = req.user.role === "admin";
    if (!isParty(booking, req.user._id) && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const data = booking.toObject();

    // Contact details are shared only after the provider accepts the request
    data.contactShared = CONTACT_STATUSES.includes(booking.status);
    if (!data.contactShared && !isAdmin) {
      data.user = { _id: booking.user._id, name: booking.user.name, city: booking.user.city };
      data.provider = {
        _id: booking.provider._id,
        name: booking.provider.name,
        shopName: booking.provider.shopName,
        city: booking.provider.city,
      };
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RENTER / PROVIDER - Send a chat message on an accepted booking
export const addBookingMessage = async (req, res) => {
  try {
    const text = req.body.text?.trim();
    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (!isParty(booking, req.user._id)) {
      return res.status(403).json({ message: "Only the renter and the bike owner can chat on this booking" });
    }
    if (!CONTACT_STATUSES.includes(booking.status)) {
      return res.status(400).json({ message: "Chat opens after the owner accepts the booking" });
    }

    booking.messages.push({ sender: req.user._id, senderName: req.user.name, text: text.slice(0, 1000) });
    await booking.save();

    res.status(201).json(booking.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER / PROVIDER / ADMIN - Cancel booking (only before the bike is handed over)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!isParty(booking, req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({ message: `This booking is ${booking.status} and can no longer be cancelled` });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER / ADMIN - Approve or reject a pending booking request
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isOwner = String(booking.provider) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: `Only pending bookings can be ${status}` });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER - Bike handed over to the renter at the shop (approved -> ongoing)
export const confirmPickup = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.provider) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the bike owner can confirm the pick-up" });
    }
    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Only approved bookings can be picked up" });
    }

    booking.status = "ongoing";
    booking.pickedUpAt = new Date();
    await booking.save();

    res.json({ message: "Bike handed over. Ride started." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER - Bike returned (ongoing -> completed)
export const confirmReturn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.provider) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the bike owner can confirm the return" });
    }
    if (booking.status !== "ongoing") {
      return res.status(400).json({ message: "Only bikes that are on a ride can be returned" });
    }

    booking.status = "completed";
    booking.returnedAt = new Date();
    await booking.save();

    res.json({ message: "Bike returned. Booking completed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
