import Bike from "../models/bikeModel.js";
import Booking from "../models/Booking.js";

// PROVIDER - Add Bike
export const addBike = async (req, res) => {
  try {
    const { name, brand, city, rentPerDay, image, description, category } = req.body;

    const bike = await Bike.create({
      provider: req.user._id,
      name,
      brand,
      city,
      rentPerDay,
      image,
      description,
      category,
    });

    res.status(201).json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUBLIC - Get All Bikes
export const getAllBikes = async (req, res) => {
  try {
    // Hide bikes the provider has marked unavailable (old records without the field count as available)
    const bikes = await Bike.find({ isAvailable: { $ne: false } }).populate("provider", "name email");
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUBLIC - Get Single Bike
export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate(
      "provider",
      "name email"
    );

    if (bike) {
      res.json(bike);
    } else {
      res.status(404).json({ message: "Bike not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER - Get My Bikes
export const getMyBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({ provider: req.user._id });
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER - Delete Bike
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    if (bike.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this bike" });
    }

    await bike.deleteOne();
    res.json({ message: "Bike removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROVIDER - Update Bike
export const updateBike = async (req, res) => {
  try {
    const { name, brand, city, rentPerDay, image, description, category, isAvailable } = req.body;
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    if (bike.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this bike" });
    }

    bike.name = name || bike.name;
    bike.brand = brand || bike.brand;
    bike.city = city || bike.city;
    bike.rentPerDay = rentPerDay || bike.rentPerDay;
    bike.image = image || bike.image;
    if (description !== undefined) bike.description = description;
    if (category !== undefined) bike.category = category;
    if (isAvailable !== undefined) bike.isAvailable = Boolean(isAvailable);

    const updatedBike = await bike.save();
    res.json(updatedBike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBikeReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const score = Number(rating);

    if (!score || score < 1 || score > 5 || !comment?.trim()) {
      return res.status(400).json({ message: "Rating (1-5) and comment are required" });
    }

    const bike = await Bike.findById(req.params.id);

    if (bike) {
      // Only renters who actually picked up this bike may review it
      const hasRidden = await Booking.exists({
        bike: bike._id,
        user: req.user._id,
        status: { $in: ["ongoing", "completed"] },
      });

      if (!hasRidden) {
        return res.status(403).json({ message: "You can review a bike after you have picked it up" });
      }

      const alreadyReviewed = bike.reviews.find(
        r => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Bike already reviewed" });
      }

      const review = {
        name: req.user.name,
        rating: score,
        comment: comment.trim(),
        user: req.user._id
      };

      bike.reviews.push(review);
      bike.numReviews = bike.reviews.length;
      bike.rating =
        bike.reviews.reduce((acc, item) => item.rating + acc, 0) /
        bike.reviews.length;

      await bike.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Bike not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};