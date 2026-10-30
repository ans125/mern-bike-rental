# Admin – Bookings — `/admin/bookings`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Admin/AdminBookings.jsx` · **Guard:** `AdminRoute`
- **API:** `GET /api/admin/bookings` — all bookings newest first, with user, provider and bike.
- **Columns:** booking ID, customer, bike + owner, period, status badge, total and platform fee (commission). Read-only.
- **List:** 12 per page, status filter and search by customer/owner/bike/ID. Confirmations and errors use SweetAlert (`utils/alerts.js`).
