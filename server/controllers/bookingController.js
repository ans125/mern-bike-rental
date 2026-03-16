import Booking from "../models/Booking.js";
import Bike from "../models/bikeModel.js";


// USER - Create Booking
// export const createBooking = async (req, res) => {
//   try {
//     const { bikeId, startDate, endDate } = req.body;

//     const bike = await Bike.findById(bikeId);

//     if (!bike) {
//       return res.status(404).json({ message: "Bike not found" });
//     }

//     const days =
//       (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

//     const totalPrice = days * bike.rentPerDay;

//     const booking = await Booking.create({
//       bike: bike._id,
//       user: req.user._id,
//       provider: bike.provider,
//       startDate,
//       endDate,
//       totalPrice,
//     });

//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const createBooking = async (req, res) => {
  try {
    const { bikeId, startDate, endDate } = req.body;

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    // Check overlapping bookings
    const existingBooking = await Booking.findOne({
      bike: bikeId,
      status: { $ne: "cancelled" },
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Bike already booked for these dates",
      });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

    const totalPrice = days * bike.rentPerDay;

    const booking = await Booking.create({
      bike: bike._id,
      user: req.user._id,
      provider: bike.provider,
      startDate,
      endDate,
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


// USER - Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};