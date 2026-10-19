# AI Chatbot

Back to [index](../../CLAUDE.md)

- **UI:** `client/src/components/Chatbot/ChatButton.jsx`, mounted on the Home page only. Floating green button →
  chat window ("RideRent AI · Powered by Gemini").
- **Flow:** user message → `api.post("/chat", { message })` → server `controllers/chatController.js` →
  Google Gemini `gemini-2.5-flash` → `{ reply }`.
- **Context:** the server adds the live bike list (name, brand, city, Rs./day, max 50) to the system prompt,
  so the bot can answer "cheapest bike in Lahore?" with real data.
- **Key:** `GEMINI_API_KEY` in `server/.env` only. If missing, the server replies with a "not configured" message.
  Never move the key back into a `VITE_*` variable — that would publish it in the browser bundle.
- **Safety:** replies are rendered as plain text (`white-space: pre-wrap`), not HTML. Input is trimmed to 1000 chars.
- Single-turn: previous messages are not sent to Gemini.
