# Provider – My Bikes — `/provider/my-bikes`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderBikes.jsx` · **Guard:** `ProviderRoute`
- **API:** `getMyBikes()` → `GET /api/bikes/my/bikes`; `updateBike(id, data)` → `PUT /api/bikes/:id`;
  `deleteBike(id)` → `DELETE /api/bikes/:id`; optional new photo via `POST /api/upload`.
- **Table:** image, name, city, brand, rent/day, rating (count), **Available** switch, edit and delete buttons.
- **Available switch:** sends `{ isAvailable }`. Unavailable bikes disappear from the public list and cannot be booked.
- **Edit modal:** name, brand, city, rent/day, bike type, description, optional new photo.
- Server checks the bike belongs to the logged-in provider for update/delete.
- **List:** 8 per page. Confirmations and errors use SweetAlert (`utils/alerts.js`).
