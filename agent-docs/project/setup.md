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

## Seed demo data (optional, once)
```
cd server && node seedUsers.js && node seedBikes.js
```
Creates `admin@example.com`, `provider@example.com`, `user@example.com` (see `seedUsers.js` for the password) and 5 bikes.

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
