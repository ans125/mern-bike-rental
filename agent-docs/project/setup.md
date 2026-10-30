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
- Backend: not deployed. To deploy later: host `server/` (e.g. Render), move DB to MongoDB Atlas, then set
  `VITE_API_URL=https://<backend>/api` in Vercel → Project → Settings → Environment Variables and redeploy.
  Uploaded images are stored on local disk (`server/uploads`) — use cloud storage if the host has ephemeral disk.
