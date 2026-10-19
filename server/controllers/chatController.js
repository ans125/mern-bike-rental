import Bike from "../models/bikeModel.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// PUBLIC - Ask the RideRent AI assistant (Gemini key stays on the server)
export const askAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: "The assistant is not configured yet. Add GEMINI_API_KEY to server/.env.",
      });
    }

    // Give the assistant the live bike list so it can answer real price/city questions
    const bikes = await Bike.find({}, "name brand city rentPerDay").limit(50);
    const bikeList = bikes
      .map((b) => `- ${b.name} (${b.brand}), ${b.city}, Rs. ${b.rentPerDay}/day`)
      .join("\n");

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: {
            text:
              "You are a professional, helpful customer support assistant for 'RideRent', " +
              "a bike rental platform in Pakistan. Prices are in PKR (Rs.). Keep answers concise. " +
              "Users book a bike from its page by picking dates; providers list bikes after admin approval.\n" +
              `Bikes currently listed:\n${bikeList || "- none yet"}`,
          },
        },
        contents: [{ parts: [{ text: message.trim().slice(0, 1000) }] }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(502).json({ message: data.error.message });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not exactly sure how to answer that.";

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
