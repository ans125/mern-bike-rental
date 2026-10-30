# AI Customer Support chat

Back to [index](../../CLAUDE.md)

- **UI:** `client/src/components/Chatbot/ChatButton.jsx` (component `CustomerSupport`), mounted once in `App.jsx`
  on every public page (not on admin/provider panels). Floating green button → "RideRent Support" window with
  4 quick-question buttons and a "Contact our team" link.
- **Flow:** `askSupportAssistant(message, history)` (`services/supportService.js`) → `POST /api/chat` →
  `controllers/chatController.js` → Google Gemini → `{ reply }`.
- **Context sent to Gemini:** a fixed support guide (how booking, approval, cancellation, reviews, providers and
  commission work), the live list of available bikes (max 80, cheapest first, with category and rating), the last 10 chat turns, and — if the visitor is
  logged in (`optionalAuth`) — their name, role and last 10 bookings with status.
- **Model:** first `gemini-flash-latest` (newest Flash, or `GEMINI_MODEL` from `.env`) with a 12 s timeout;
  on timeout/error falls back to `gemini-2.5-flash`. If both fail, a polite "use the Contact page" reply.
- **Key:** `GEMINI_API_KEY` in `server/.env` only — never in a `VITE_*` variable.
- **Safety:** replies are plain text (`white-space: pre-wrap`, `**` removed), input trimmed to 1000 chars.
