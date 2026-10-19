# Bike Details & Booking — `/bike/:id`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Bike/BikeDetails.jsx` · **Access:** public to view; must be logged in to book
- **API:** `getBikeById(id)` → `GET /api/bikes/:id`; `createBooking({ bikeId, startDate, endDate })` → `POST /api/bookings`.
- **Price logic:** days = whole days between the dates, **minimum 1** (same day = 1). Total = days × `rentPerDay`.
  The server recomputes it the same way and saves its own value.
- **Validation:** dates required, end ≥ start, start ≥ today (date input `min`). The server also rejects overlaps
  with any non-cancelled booking → "Bike already booked for these dates".
- **After booking:** redirect to `/user/dashboard`. Not logged in → alert + redirect to `/login`.
- **Gaps:** no reviews UI yet (see [known gaps](../project/known-gaps.md)).
