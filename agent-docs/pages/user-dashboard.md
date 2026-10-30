# User Dashboard — `/user/dashboard`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/User/UserDashboard.jsx` · **Guard:** `ProtectedRoute` (customers only)
- **Banner:** verification pending, or rejected with the admin's reason (fresh status from `refreshStoredUser()`).
- **Bookings:** `GET /api/bookings/my`; status pills with counts (All, Pending, Accepted, On ride, Completed,
  Cancelled/Rejected); 8 per page (`usePagination` + `TablePagination`).
- **Actions:** **Details & chat** opens [BookingDetailsModal](../frontend/booking-details.md) (contacts, shop address, chat);
  **Cancel** (SweetAlert confirm) for pending/accepted bookings that have not started.
