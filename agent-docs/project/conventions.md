# Coding conventions

Back to [index](../../CLAUDE.md)

Priority: **correctness → clean structure → minimal code → scalability.**

## General
- ES modules (`import`/`export`) in both client and server; async/await with try/catch everywhere.
- Follow the existing folder structure; modify only the parts a change needs; don't break existing APIs.
- Short comments only where the *why* isn't obvious.

## Backend
- MVC: `routes/` stay thin, `controllers/` hold logic, `models/` are Mongoose schemas.
- Always return JSON `{ message }` on errors with a proper status (400 validation, 401 no/invalid token,
  403 wrong role, 404 not found, 500 unexpected).
- Protect routes with `protect` + `adminOnly` / `providerOnly` from `middleware/authMiddleware.js`.
- Document new endpoints with a `@swagger` JSDoc block in the route file.

## Frontend
- Functional components + hooks. React Bootstrap for layout; theme green `#198754`, light theme.
- All HTTP goes through `src/services/*` → `src/api/axios.js` (adds the JWT automatically).
- Logged-in user is in `localStorage["user"]`; read it with `getStoredUser()` from `authService`.
- Prices are PKR, shown as `Rs. <amount>`.
- Never render API/AI text with `dangerouslySetInnerHTML`.
- Pop-ups: SweetAlert2 through `utils/alerts.js` only — no `window.alert` / `window.confirm`.
- Lists longer than one screen use `usePagination` + `TablePagination` (memoize the list you pass in).
- Required form fields show a red `*`; validate on the client for UX and again on the server.
