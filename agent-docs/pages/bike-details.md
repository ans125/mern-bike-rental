# Bike Details & Booking — `/bike/:id`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Bike/BikeDetails.jsx` · **Access:** public to view; must be logged in to book
- **API:** `getBikeById(id)` → `GET /api/bikes/:id`; `createBooking({ bikeId, startDate, endDate })` → `POST /api/bookings`;
  `addReview(id, { rating, comment })` → `POST /api/bikes/:id/reviews`.
- **Shows:** brand, name, city, photo, provider's description (fallback text if empty), rating, reviews list.
- **Price logic:** days = whole days between the dates, **minimum 1**. Total = days × `rentPerDay`.
  The server recomputes it and also stores the 10% `commission` and `providerEarning`.
- **Validation:** dates required, end ≥ start, start ≥ today. Server rejects overlaps with any booking that is not
  `cancelled`/`rejected`, and rejects bikes with `isAvailable: false` (button is disabled with a warning).
- **After booking:** status is **Pending** until the provider accepts; redirect to `/user/dashboard`.
- **Reviews:** form shows for logged-in renters (`role: user`); the server only accepts it if that renter has a
  non-cancelled/non-rejected booking for this bike, and only once per renter.
