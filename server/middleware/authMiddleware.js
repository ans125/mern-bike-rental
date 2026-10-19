import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    // Token is valid but the account was deleted
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

export const providerOnly = (req, res, next) => {
  if (req.user && req.user.role === "provider") {
    if (!req.user.isApproved) {
      return res.status(403).json({
        message: "Provider account pending admin approval",
      });
    }

    next();
  } else {
    res.status(403).json({ message: "Provider access only" });
  }
};
