# User Dashboard — `/user/dashboard`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/User/UserDashboard.jsx` · **Guard:** `ProtectedRoute` (any logged-in user)
- **Shows:** profile card (name, role, email, avatar from ui-avatars.com) + "My Rental History" table.
- **API:** `getMyBookings()` → `GET /api/bookings/my`; `cancelBooking(id)` → `PUT /api/bookings/cancel/:id`.
- **Status badge:** `Cancelled` (from status), else `Completed` if the end date has passed, else `Scheduled`.
- **Cancel button:** only for non-cancelled bookings whose start date is in the future.
