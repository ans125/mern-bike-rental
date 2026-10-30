# RideRent — Coding Agent Index

Read this file first. It is the parent reference for every coding agent (Claude Code, Cursor, Copilot, etc.)
and links to one small doc per page / backend area in [agent-docs/](agent-docs/).

**Project:** RideRent — a MERN bike rental marketplace (university FYP). Three roles: `user` (renter),
`provider` (bike owner, needs admin approval), `admin`. Bookings need provider approval; the platform keeps a
10% commission; accounts are verified by CNIC (KYC); after acceptance renter and owner chat and the owner marks hand-over and return;
an AI customer support chat (Google Gemini) and a Contact/support inbox help users.

| Item | Value |
|---|---|
| Frontend | `client/` — React 19 + Vite 7 + React Router 7 + React Bootstrap |
| Backend | `server/` — Node 22 + Express 5 + Mongoose 9 + JWT + Multer |
| Database | Local dev: MongoDB on `localhost:27017` (Compass). Live: MongoDB Atlas free M0 (Mumbai), db `riderent` |
| Live frontend | https://riderent-tawny.vercel.app/ (Vercel, root dir `client`, auto-deploys from `main`) |
| Repo | https://github.com/ans125/mern-bike-rental (public) |
| Live backend | https://riderent-api.onrender.com (Render free web service, root dir `server`, auto-deploys from `main`; Swagger at `/api-docs`) |

## Index

### Project
- [Setup & running locally](agent-docs/project/setup.md)
- [Coding conventions](agent-docs/project/conventions.md)
- [Documentation maintenance rules](agent-docs/project/docs-maintenance.md) — **must follow after every change**
- [Changelog](agent-docs/project/changelog.md)
- [Known gaps / future work](agent-docs/project/known-gaps.md)

### Frontend pages (route → doc)
| Route | Doc |
|---|---|
| `/` | [Home](agent-docs/pages/home.md) |
| `/bike` | [Browse Bikes](agent-docs/pages/browse-bikes.md) |
| `/bike/:id` | [Bike Details & Booking](agent-docs/pages/bike-details.md) |
| `/login` | [Login](agent-docs/pages/login.md) |
| `/register` | [Register](agent-docs/pages/register.md) |
| `/about`, `/contact` | [About & Contact / Support](agent-docs/pages/about-contact.md) |
| `/user/dashboard` | [User Dashboard](agent-docs/pages/user-dashboard.md) |
| `/provider/dashboard` | [Provider Dashboard](agent-docs/pages/provider-dashboard.md) |
| `/provider/my-bikes` | [Provider – My Bikes](agent-docs/pages/provider-bikes.md) |
| `/provider/add-bike` | [Provider – Add Bike](agent-docs/pages/provider-add-bike.md) |
| `/provider/bookings` | [Provider – Booking Requests](agent-docs/pages/provider-bookings.md) |
| `/admin/dashboard` | [Admin Dashboard](agent-docs/pages/admin-dashboard.md) |
| `/admin/users` | [Admin – Users](agent-docs/pages/admin-users.md) |
| `/admin/verifications` | [Admin – Verifications (KYC)](agent-docs/pages/admin-verifications.md) |
| `/admin/bikes` | [Admin – Bikes](agent-docs/pages/admin-bikes.md) |
| `/admin/bookings` | [Admin – Bookings](agent-docs/pages/admin-bookings.md) |
| `/admin/messages` | [Admin – Support Messages](agent-docs/pages/admin-messages.md) |

### Shared frontend pieces
- [Layout, header, footer, route guards](agent-docs/frontend/layout-and-guards.md)
- [Services & API client](agent-docs/frontend/services.md)
- [AI Customer Support chat](agent-docs/frontend/chatbot.md)
- [Booking details, chat & safe hand-over](agent-docs/frontend/booking-details.md)

### Backend
- [API endpoints](agent-docs/backend/api.md)
- [Database models](agent-docs/backend/models.md)
- [Auth, roles & approval](agent-docs/backend/auth-and-roles.md)
- [Uploads & seed scripts](agent-docs/backend/uploads-and-seeds.md)

### Human-facing docs (HTML)
- `client/public/project-overview.html` — **public**, non-technical overview for supervisors / PMs.
  Live at https://riderent-tawny.vercel.app/project-overview.html
- `internal-docs/backend-guide.html` — **private** (gitignored) backend team guide. Never commit it.

## Hard rules
1. **Never commit secrets.** `server/.env` and `client/.env` are gitignored. Only `VITE_*` vars reach the browser —
   never put API keys there (the Gemini key lives in `server/.env` as `GEMINI_API_KEY`).
2. Components call the backend **only** through `client/src/services/*` (which use `client/src/api/axios.js`).
3. Server flow is **Route → Middleware (`protect`, `adminOnly`, `providerOnly`) → Controller → Model**.
   Access control must be enforced on the server; client route guards are only for UX.
4. Admin accounts are never created through `/api/auth/register` — only via `server/seedUsers.js`.
5. CNIC images live in `server/private/kyc` and are only served through the admin API — never make them public.
6. After any change, follow [docs-maintenance.md](agent-docs/project/docs-maintenance.md).
