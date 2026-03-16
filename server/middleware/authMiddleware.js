import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// export const providerOnly = (req, res, next) => {
//   if (req.user && req.user.role === "provider") {
//     next();
//   } else {
//     res.status(403).json({ message: "Provider access only" });
//   }
// };
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