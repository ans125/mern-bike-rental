# Changelog

Back to [index](../../CLAUDE.md) · newest first

## 2026-10-28
- **Simplified hand-over:** removed the 6-digit pick-up code (`Booking.pickupCode`), the WhatsApp button and the Google Maps
  link. The owner presses **Hand over** (confirm pop-up) → `ongoing`; `PUT /api/bookings/:id/pickup` takes no body.
- **Bike photos:** 15 real model photos added in `server/uploads/bikes/`; the seed now reuses them for models without
  their own photo (same or similar category) instead of online stock photos.
- Docs: AI chat and admin chart data flow explained in chatbot.md, admin-dashboard.md and both private guides.
- Out-of-scope list in known-gaps.md: no payments, SMS/OTP, external services, re-upload, reports or date search.

## 2026-10-27
- **KYC signup:** Pakistani fields (CNIC, mobile, city, address, licence / shop name), CNIC front+back uploads stored privately,
  dynamic server-checked captcha, required-field asterisks; customers **and** providers wait for admin approval.
- **Admin Verifications** page (replaces Providers): pending/approved/rejected tabs, CNIC viewer, approve, reject with reason.
- **Safe hand-over:** contacts (call, WhatsApp, shop address + Maps) and per-booking chat unlock after acceptance; 6-digit
  pick-up code starts the ride (`ongoing`); owner marks returned (`completed`). New `BookingDetailsModal` with safety checklist.
- **Rules:** customers only, verified only, no past dates, max 30 days, cancel only before pick-up, review only after pick-up.
- **Pagination + filters** on all booking, user, bike, verification, message and fleet lists; **SweetAlert2** replaces js alerts.
- **Admin charts:** monthly revenue and bookings by status (Recharts) with table toggle.
- Seed: KYC data, sample CNIC cards, 6 months of history, pick-up codes, chats, pending/rejected accounts, optional per-model photos.

## 2026-10-26
- **Demo data:** `server/seedDemoData.js` — Pakistani bike models in 8 cities, 10 providers (2 pending), 12 customers,
  ~95 bikes, ~480 bookings in every status, reviews and support messages; `--reset` removes it. Test accounts in setup.md.
- **Bike category** field (70cc … Electric) on the Bike model, add/edit forms, bike page badge and support chat context.
- **Browse Bikes upgrade:** search, dynamic city list, type chips, sorting, brand counts, result count, Load more,
  URL filters (`?city=`, `?category=`). **Home:** browse-by-city/type shortcuts, top-rated slider.

## 2026-10-21
- **AI customer support:** chat widget on every public page with conversation memory, quick questions, live bike
  list and (when logged in) the user's own bookings; newest Gemini Flash with automatic fallback to `gemini-2.5-flash`.
- **Contact & support inbox:** working Contact page (`POST /api/support`) and admin "Support Messages" page.
- **Booking approval:** new statuses `rejected`; providers Accept/Reject pending requests (`PUT /api/bookings/:id/status`).
- **Commission & earnings:** each booking stores `commission` (10%) and `providerEarning`; admin dashboard shows
  revenue and platform earnings; provider dashboard shows earnings and waiting requests.
- **Fleet management:** edit bike modal, description field, availability switch (unavailable bikes hidden and not bookable).
- **Reviews:** review list and form on bike page; only renters who booked the bike can review.
- `/user/dashboard` is now renters only; shared `StatusBadge` component; header Contact link.

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
