# Provider – My Bikes — `/provider/my-bikes`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderBikes.jsx` · **Guard:** `ProviderRoute`
- **API:** `getMyBikes()` → `GET /api/bikes/my/bikes`; delete → `deleteBike(id)` → `DELETE /api/bikes/:id`
  (the server checks the bike belongs to this provider).
- **Table:** image, name, city, brand, rent/day, rating, actions.
- **Gap:** the Edit (pencil) button has no handler yet; `PUT /api/bikes/:id` is ready on the server.
