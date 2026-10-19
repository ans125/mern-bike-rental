# Known gaps / future work

Back to [index](../../CLAUDE.md)

Features that exist in the plan or backend but are not finished in the UI. Pick from here for next tasks.

| Gap | Where | Notes |
|---|---|---|
| Backend not deployed | — | Live Vercel site shows no data. See [setup.md](setup.md#deployment). |
| Edit bike | `ProviderBikes.jsx` edit button does nothing | API `PUT /api/bikes/:id` already exists. |
| Reviews UI | `BikeDetails.jsx` | API `POST /api/bikes/:id/reviews` exists; no form or review list yet. |
| Booking approval | `Booking.status` has `approved` | Nothing sets it; providers can't approve/reject requests. |
| Reject provider | `AdminProviders.jsx` | "Reject" deletes the account; no soft reject. |
| Contact page | `pages/Contact.jsx` | Placeholder only; not linked in header. |
| `/user/dashboard` role check | `ProtectedRoute.jsx` | Any logged-in role can open it. |
| `isAvailable` flag | `Bike` | Not used in filters or booking. |
| Payments / earnings | — | Out of FYP scope; listed as future enhancement. |
| Tests | — | No automated tests. |
