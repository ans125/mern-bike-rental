# Browse Bikes — `/bike`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Bike/Bike.jsx` · **Access:** public
- **Purpose:** grid of all bikes with filters.
- **API:** `getAllBikes()` → `GET /api/bikes` (once on load).
- **Filters (client-side):** city dropdown (Lahore, Karachi, Islamabad, Faisalabad — hard-coded), max rent/day slider
  (Rs. 100–10,000, default 5,000), brand checkboxes built from the loaded bikes.
- **Images:** `resolveBikeImageUrl()` turns `/uploads/x.jpg` into a full backend URL; placeholder on error.
- **Related:** [Bike Details](bike-details.md), [services](../frontend/services.md)
