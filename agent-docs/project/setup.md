# Setup & running locally

Back to [index](../../CLAUDE.md)

## Requirements
- Node.js 22 (`node -v`)
- MongoDB running locally on `localhost:27017` (MongoDB Compass connects to the same address)

## Environment files (never commit)
`server/.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/<db-name>
JWT_SECRET=<long random string>
GEMINI_API_KEY=<Google AI Studio key, optional — chatbot>
```
`client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Run (two terminals)
```
cd server && npm install && npm run dev     # API on http://localhost:5000, Swagger at /api-docs
cd client && npm install && npm run dev     # UI on http://localhost:5173
```

## Seed demo data
```
cd server && node seedDemoData.js     # large Pakistani demo data set; re-run any time to reset it
```
Details in [uploads-and-seeds.md](../backend/uploads-and-seeds.md).

## Test accounts
Local demo data only — never use these on a real deployment.

Demo accounts end in `@demo.riderent.pk` with password `demo1234`; base accounts use `anas123`.

| Portal / state | Email | Password | Use it to test |
|---|---|---|---|
| Admin | `admin@example.com` | `anas123` | charts, verifications (4 pending, 2 rejected), bookings, support inbox |
| Provider — verified, rich data | `ali.rentals@demo.riderent.pk` | `demo1234` | Lahore shop: accept/reject requests, hand over, mark returned, chat, edit bikes |
| Provider — verified, other cities | `karachi.ride`, `capital.bikes`, `pindi.motors`, `faisal.motors`, `multan.wheels`, `khyber.riders`, `sialkot.auto` | `demo1234` | same per city |
| Provider — pending | `quetta.hub`, `hyderabad.rides` | `demo1234` | "pending approval" screen; approve from admin |
| Provider — rejected | `gujranwala.bikes` | `demo1234` | rejection reason banner |
| Provider — basic | `provider@example.com` | `anas123` | 5 older bikes, no KYC data |
| Customer — verified, rich data | `ahmed@demo.riderent.pk` | `demo1234` | bookings in every status, chat, cancel, review |
| Customers — verified | `fatima`, `bilal`, `ayesha`, `usman`, `hira`, `hamza`, `zainab`, `saad`, `maryam`, `hassan`, `sana` | `demo1234` | more bookings and reviews |
| Customer — pending | `kamran`, `nida` | `demo1234` | can browse, booking blocked until admin approves |
| Customer — rejected | `imran` | `demo1234` | rejection reason banner |
| Customer — verified, empty | `user@example.com` | `anas123` | a fresh booking from scratch |

## Checks before committing
```
cd client && npm run lint && npm run build
cd server && node --check server.js
```

## Deployment
- Frontend: Vercel project with **Root Directory = `client`**. Pushing to `main` on GitHub redeploys automatically.
  `client/vercel.json` rewrites all paths to `index.html` (SPA routing).
  Framework Preset **Vite**. Env var `VITE_API_URL=https://riderent-api.onrender.com/api` (type **Config**, all environments).
  Changing an env var needs a redeploy; "Redeploy" rebuilds the *same* commit, so push a new commit to deploy new code.
- Backend: **Render** free web service `riderent-api` → https://riderent-api.onrender.com (region Oregon).
  Root Directory `server`, build `npm install`, start `npm start`. Env vars: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`,
  `NODE_VERSION=22` (do not set `PORT`). Auto-deploys on push to `main`.
- Database: **MongoDB Atlas** free M0 cluster (AWS Mumbai), database `riderent`, Network Access `0.0.0.0/0`.
  Load / reset live demo data from your PC without touching `.env` (PowerShell):
  `$env:MONGO_URI="<atlas string>"; node seedUsers.js; node seedDemoData.js`
- Free-tier notes: Render sleeps after ~15 min idle (open the site a minute before a demo, or ping `/api-docs` with
  UptimeRobot every 5 min). Render's disk is temporary: files uploaded on the live site disappear on restart.
