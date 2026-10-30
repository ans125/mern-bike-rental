import crypto from "crypto";
import jwt from "jsonwebtoken";

// Dynamic math captcha. The answer is never sent to the browser: the token only holds an HMAC of it,
// signed and valid for 10 minutes, so the server can check the reply without storing anything.
const hashAnswer = (answer) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET).update(String(answer)).digest("hex");

export const createCaptcha = () => {
  const a = crypto.randomInt(2, 20);
  const b = crypto.randomInt(1, 10);
  const useAdd = crypto.randomInt(0, 2) === 0;
  const question = useAdd ? `${a} + ${b}` : `${a + b} - ${b}`;
  const answer = useAdd ? a + b : a;

  const token = jwt.sign({ purpose: "captcha", h: hashAnswer(answer) }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  return { question, token };
};

export const verifyCaptcha = (token, answer) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data.purpose === "captcha" && data.h === hashAnswer(String(answer).trim());
  } catch {
    return false;
  }
};
