# Provider – Add Bike — `/provider/add-bike`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderAddBike.jsx` · **Guard:** `ProviderRoute` (server allows approved providers only)
- **Fields:** name, brand, city, rent per day (PKR), image (required, jpg/jpeg/png).
- **Flow:** 1) `POST /api/upload` (multipart, field `image`) → returns a path like `/uploads/1712345678.jpg`;
  2) `addBike({ name, brand, city, rentPerDay, image })` → `POST /api/bikes`; 3) redirect to My Bikes.
- **Fixed 2026-10-19:** the page crashed because the `Info` icon was not imported.
