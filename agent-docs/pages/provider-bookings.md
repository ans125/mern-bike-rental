# Provider – Bookings — `/provider/bookings`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderBookings.jsx` · **Guard:** `ProviderRoute`
- **API:** `getProviderBookings()` → `GET /api/bookings/provider` (bookings where `provider` = me, with bike + user).
- **Table:** customer, vehicle, rental period, status (Cancelled / Completed / Active), earnings (`totalPrice`).
- **Gap:** the provider cannot approve/reject requests from the UI yet.
