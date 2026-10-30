import mongoose from "mongoose";

// Customer support tickets sent from the Contact page
const supportMessageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Set when the sender was logged in
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SupportMessage", supportMessageSchema);
