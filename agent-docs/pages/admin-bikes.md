# Admin – Bikes — `/admin/bikes`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Admin/AdminBikes.jsx` · **Guard:** `AdminRoute`
- **API:** `GET /api/admin/bikes` (all bikes + provider name/email); delete any bike → `DELETE /api/admin/bikes/:id`.
- **List:** 10 per page, city filter and search; availability badge. Confirmations and errors use SweetAlert (`utils/alerts.js`).
