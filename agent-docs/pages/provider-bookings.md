# Provider – Bookings — `/provider/bookings`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderBookings.jsx` · **Guard:** `ProviderRoute`
- **API:** `GET /api/bookings/provider`.
- **Pills:** Requests (pending), Accepted, On ride, Completed, Cancelled/Rejected, All; search by customer or bike; 10 per page.
- **Actions:** Pending → **Accept** / **Reject** (SweetAlert). Accepted → **Hand over** opens
  [BookingDetailsModal](../frontend/booking-details.md) where the provider presses **Hand over** → ride starts.
  On ride → **Return** → "Mark returned" completes it. Accepted and not started → cancel.
