# Changelog

Back to [index](../../CLAUDE.md) · newest first

## 2026-10-19
- **Security:** `/api/auth/register` rejects `role: "admin"`; only `user`/`provider` can self-register.
- **Security:** Gemini API key moved from the browser bundle to the server — new `POST /api/chat` endpoint;
  chatbot no longer renders AI text as raw HTML.
- **Fix:** Register page now really creates the account (it previously only showed an alert).
- **Fix:** Provider "Add Bike" page crashed (missing `Info` icon import).
- **Fix:** Login/register now return `isApproved`; new `GET /api/auth/me`; provider dashboard refreshes approval
  status and shows real bike / active booking counts.
- **Fix:** Booking price uses at least 1 day (same-day was Rs. 0); invalid/reversed dates rejected;
  provider and admin may cancel too; cancelled bookings show "Cancelled" in dashboards.
- **Fix:** `protect` middleware handles deleted users; upload without file returns 400; errors return JSON.
- **Fix:** Admin cannot delete admin accounts; deleting a provider also removes their bikes.
- **Fix:** Header login state stays in sync after login/logout; Swagger paths corrected (`/api/auth/*`).
- **Cleanup:** removed duplicate `models/Bike.js`, empty `userRoutes.js`, unused `UserRegister.jsx`,
  `ChatWindow.jsx`, `data/bikes.js`, `assets/react.svg`, stray `router` package, old root `.md` notes, `prompt/`,
  `graphify-out/`. Added `CLAUDE.md`, `agent-docs/`, public project overview and private backend guide.

## 2026-04-08 (earlier work, summarised from old logs)
- Seed scripts for 3 demo users and 5 bikes; real login with role-based redirect.
- Currency switched to `Rs.`; Browse Bikes uses live API with city / max price / brand filters.
- Bike details page wired to `getBikeById` and booking API with overlap check.
- Home slider uses live bikes; chatbot redesigned with Gemini 2.5 Flash.
