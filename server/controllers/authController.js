import fs from "fs";
import path from "path";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { createCaptcha, verifyCaptcha } from "../utils/captcha.js";
import { KYC_DIR } from "../middleware/uploadMiddleware.js";

// Admin accounts can only be created by seeding the database, never by signup
const SELF_REGISTER_ROLES = ["user", "provider"];

// Pakistani formats: 03XX-XXXXXXX and 12345-1234567-1
const PHONE_REGEX = /^03\d{2}-?\d{7}$/;
const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toProfile = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  city: user.city,
  address: user.address,
  shopName: user.shopName,
  isApproved: user.isApproved,
  verificationStatus: user.isApproved ? "approved" : user.verificationStatus,
  verificationNote: user.verificationNote,
});

const toAuthResponse = (user) => ({
  ...toProfile(user),
  token: generateToken(user._id, user.role),
});

// Delete uploaded documents when registration fails, so no orphan files stay on disk
const removeUploads = (files) => {
  Object.values(files || {})
    .flat()
    .forEach((f) => fs.unlink(f.path, () => {}));
};

// PUBLIC - New math question for the signup form
export const getCaptcha = (req, res) => {
  res.json(createCaptcha());
};

// REGISTER (multipart form: text fields + cnicFront + cnicBack images)
export const registerUser = async (req, res) => {
  const fail = (status, message) => {
    removeUploads(req.files);
    return res.status(status).json({ message });
  };

  try {
    const body = req.body || {};
    const role = body.role || "user";
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const cnic = body.cnic?.trim();
    const city = body.city?.trim();
    const address = body.address?.trim();
    const licenseNumber = body.licenseNumber?.trim() || "";
    const shopName = body.shopName?.trim() || "";
    const { password, captchaToken, captchaAnswer } = body;

    if (!verifyCaptcha(captchaToken, captchaAnswer)) {
      return fail(400, "Human verification failed. Please solve the new question.");
    }
    if (!SELF_REGISTER_ROLES.includes(role)) return fail(400, "Invalid role");
    if (!name || !email || !password || !phone || !cnic || !city || !address) {
      return fail(400, "Please fill in all required fields");
    }
    if (!EMAIL_REGEX.test(email)) return fail(400, "Please enter a valid email address");
    if (!PHONE_REGEX.test(phone)) return fail(400, "Phone must be a Pakistani mobile number like 0300-1234567");
    if (!CNIC_REGEX.test(cnic)) return fail(400, "CNIC must be in the format 12345-1234567-1");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return fail(400, "Password must be at least 8 characters with letters and numbers");
    }
    if (role === "user" && !licenseNumber) return fail(400, "Driving licence number is required to rent a bike");
    if (role === "provider" && !shopName) return fail(400, "Shop / business name is required for providers");

    const cnicFront = req.files?.cnicFront?.[0];
    const cnicBack = req.files?.cnicBack?.[0];
    if (!cnicFront || !cnicBack) return fail(400, "Please upload both sides of your CNIC");

    if (await User.exists({ email })) return fail(400, "An account with this email already exists");
    if (await User.exists({ cnic })) return fail(400, "An account with this CNIC already exists");

    const salt = await bcrypt.genSalt(10);
    const user = await User.create({
      name,
      email,
      phone: phone.includes("-") ? phone : `${phone.slice(0, 4)}-${phone.slice(4)}`,
      password: await bcrypt.hash(password, salt),
      role,
      cnic,
      city,
      address,
      licenseNumber: role === "user" ? licenseNumber : "",
      shopName: role === "provider" ? shopName : "",
      documents: { cnicFront: cnicFront.filename, cnicBack: cnicBack.filename },
      // Every new account waits for the admin to check the CNIC
      isApproved: false,
      verificationStatus: "pending",
    });

    res.status(201).json(toAuthResponse(user));
  } catch (error) {
    removeUploads(req.files);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json(toAuthResponse(user));
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CURRENT USER - fresh profile (e.g. to see if the account was approved)
export const getMe = async (req, res) => {
  res.json(toProfile(req.user));
};

// Used by the admin document viewer
export const kycFilePath = (fileName) => path.join(KYC_DIR, path.basename(fileName || ""));
