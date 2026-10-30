import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const SERVER_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Public bike photos, served by server.js at /uploads
const UPLOAD_DIR = path.join(SERVER_DIR, "uploads");
// Identity documents (CNIC) — NOT served statically; only the admin can open them through the API
export const KYC_DIR = path.join(SERVER_DIR, "private", "kyc");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(KYC_DIR, { recursive: true });

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Images only (jpg, jpeg, png)"));
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, UPLOAD_DIR);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// Random, unguessable names for identity documents
export const kycUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, KYC_DIR);
    },
    filename(req, file, cb) {
      cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
