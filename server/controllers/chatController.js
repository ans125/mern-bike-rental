import Bike from "../models/bikeModel.js";
import Booking from "../models/Booking.js";

// Try Google's newest Flash model first ("gemini-flash-latest", or GEMINI_MODEL in .env);
// if it is slow or fails, fall back to the stable model so customers always get an answer.
const GEMINI_MODELS = [process.env.GEMINI_MODEL || "gemini-flash-latest", "gemini-2.5-flash"];
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL_TIMEOUT_MS = 12000;

const MAX_HISTORY = 10;

// Fixed platform knowledge the assistant answers from
const SUPPORT_GUIDE = `
You are "RideRent Support", the customer support assistant of RideRent, a bike rental website in Pakistan.
Answer politely, briefly (max ~120 words) and only about RideRent. Prices are in PKR, written as "Rs.".
If you do not know something or the user needs a human (refunds, complaints, account problems),
tell them to use the Contact page (/contact) so the support team can reply by email.
Never invent bikes, prices or bookings that are not listed below.

How RideRent works:
- Renters: open "Browse Bikes", filter by city, max rent and brand, open a bike, choose pick-up and drop-off dates,
  then "Request to Book". The price is days x rent per day (same-day rental counts as 1 day). Login is required.
- New accounts upload both sides of their CNIC; the admin verifies them before customers can book or providers can list bikes.
- A new booking is "pending" until the bike's provider approves or rejects it. Renters see the status in their dashboard.
- After approval both sides see each other's phone number and pick-up address, and can chat on the booking ("Details & chat").
- Pick-up: meet at the provider's shop address, bring your original CNIC and driving licence, inspect the bike and take photos.
  The provider presses "Hand over" when you receive the bike; that starts the ride.
  The provider marks the bike returned at the end. Pay rent only at hand-over (cash or bank transfer), never in advance to unknown accounts.
- Renters can cancel pending or approved bookings before pick-up. Maximum rental is 30 days; past dates cannot be booked.
- A bike cannot be booked twice for overlapping dates.
- Reviews: only renters who picked up a bike can rate and review it.
- Providers (bike owners): register with "Become a Provider", wait for admin approval, then add bikes with photo and daily rent,
  switch bikes available/unavailable, and approve or reject booking requests. RideRent keeps a 10% platform commission.
- Accounts: register at /register, login at /login.
`;

const callGemini = async (model, apiKey, body) => {
  const response = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return data.candidates?.[0]?.content?.parts?.[0]?.text;
};

// PUBLIC (optionally logged in) - Ask the RideRent support assistant
export const askAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: "Support chat is not configured yet. Please use the Contact page and our team will reply by email.",
      });
    }

    const bikes = await Bike.find({ isAvailable: { $ne: false } }, "name brand city rentPerDay category rating")
      .sort({ rentPerDay: 1 })
      .limit(80);
    const bikeList = bikes
      .map((b) => `- ${b.name} (${b.brand}${b.category ? `, ${b.category}` : ""}), ${b.city}, Rs. ${b.rentPerDay}/day, rating ${b.rating || "new"}`)
      .join("\n");

    // Logged-in renters can ask about their own bookings
    let userContext = "The visitor is not logged in.";
    if (req.user) {
      const bookings = await Booking.find({ user: req.user._id })
        .populate("bike", "name")
        .sort({ createdAt: -1 })
        .limit(10);
      const lines = bookings.map(
        (b) =>
          `- ${b.bike?.name || "Removed bike"}: ${b.startDate.toDateString()} to ${b.endDate.toDateString()}, ` +
          `Rs. ${b.totalPrice}, status ${b.status}`
      );
      userContext =
        `The visitor is logged in as ${req.user.name} (role: ${req.user.role}).\n` +
        `Their bookings:\n${lines.join("\n") || "- none"}`;
    }

    // Previous turns from the chat window so follow-up questions make sense
    const contents = history
      .filter((m) => m && typeof m.text === "string" && (m.sender === "user" || m.sender === "bot"))
      .slice(-MAX_HISTORY)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text.slice(0, 1000) }],
      }));
    contents.push({ role: "user", parts: [{ text: message.trim().slice(0, 1000) }] });

    const body = {
      system_instruction: {
        parts: {
          text: `${SUPPORT_GUIDE}\nBikes currently available:\n${bikeList || "- none yet"}\n\n${userContext}`,
        },
      },
      contents,
    };

    let reply;
    for (const model of new Set(GEMINI_MODELS)) {
      try {
        reply = await callGemini(model, apiKey, body);
        if (reply) break;
      } catch (error) {
        console.error(`Gemini ${model} failed:`, error.message);
      }
    }

    reply = reply || "Sorry, support chat is busy right now. Please try again or use the Contact page.";

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
