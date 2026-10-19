# RideRent — Bike Rental Web Application (MERN)

University Final Year Project. RideRent is an online marketplace where bike owners (**providers**) list bikes for rent
and customers (**users**) search, view and book them for chosen dates. An **admin** approves providers and manages
the platform.

- **Live site:** https://riderent-tawny.vercel.app/ (frontend only for now; the backend runs locally)
- **Project overview (non-technical):** [client/public/project-overview.html](client/public/project-overview.html) —
  also at https://riderent-tawny.vercel.app/project-overview.html
- **For developers & coding agents:** start at [CLAUDE.md](CLAUDE.md)

## Tech stack
MongoDB · Express.js · React (Vite) · Node.js · JWT auth · Multer uploads · Google Gemini (AI assistant)

## Run it locally
You need **Node.js 22** and **MongoDB** running on `localhost:27017`.

1. Create `server/.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rideRent
   JWT_SECRET=change-me-to-a-long-random-string
   GEMINI_API_KEY=optional-google-ai-studio-key
   ```
2. Create `client/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the backend:
   ```
   cd server
   npm install
   node seedUsers.js && node seedBikes.js   # first time only: demo accounts + bikes
   npm run dev
   ```
4. In a second terminal, start the frontend:
   ```
   cd client
   npm install
   npm run dev
   ```
5. Open http://localhost:5173. API docs: http://localhost:5000/api-docs

## Folder structure
```
client/        React app (pages, components, services, route guards)
server/        Express API (routes → middleware → controllers → models)
agent-docs/    Per-page and per-module docs for developers / AI coding agents
CLAUDE.md      Index of all docs and project rules
```

## Future enhancements
Edit bikes, ratings & reviews UI, provider booking confirmation, online payments, earnings module, car rentals.
