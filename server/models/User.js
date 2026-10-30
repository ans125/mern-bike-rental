import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Pakistani mobile number, stored as 03XX-XXXXXXX
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "provider", "user"],
      default: "user",
    },

    // Identity (KYC) details checked by the admin before approval
    cnic: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    // Customers: driving licence number
    licenseNumber: {
      type: String,
      default: "",
    },
    // Providers: shop / business name; address above is their pick-up location
    shopName: {
      type: String,
      default: "",
    },
    // File names inside server/private/kyc (never served publicly)
    documents: {
      cnicFront: { type: String, default: "" },
      cnicBack: { type: String, default: "" },
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Reason shown to the user when the admin rejects the documents
    verificationNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
