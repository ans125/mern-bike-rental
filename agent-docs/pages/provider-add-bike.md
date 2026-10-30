# Provider – Add Bike — `/provider/add-bike`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderAddBike.jsx` · **Guard:** `ProviderRoute` (server allows approved providers only)
- **Fields:** name, brand, city, rent per day (PKR), bike type (category, required), description (optional),
  image (required, jpg/jpeg/png).
- **Flow:** 1) `POST /api/upload` (multipart, field `image`) → path like `/uploads/1712345678.jpg`;
  2) `addBike({ name, brand, city, rentPerDay, description, image })` → `POST /api/bikes`; 3) redirect to My Bikes.
