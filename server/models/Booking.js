import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // Platform's share of totalPrice (commission model from the project proposal)
    commission: {
      type: Number,
      default: 0,
    },
    providerEarning: {
      type: Number,
      default: 0,
    },
    // pending -> approved / rejected (provider) -> ongoing (bike handed over) -> completed (bike returned)
    // pending / approved can also be cancelled by the renter, provider or admin
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    pickedUpAt: Date,
    returnedAt: Date,
    // Chat between renter and provider for this booking
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);