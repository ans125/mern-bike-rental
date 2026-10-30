# Admin – Users — `/admin/users`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Admin/AdminUsers.jsx` · **Guard:** `AdminRoute`
- **API:** `getUsers()` → `GET /api/admin/users`; `deleteUser(id)` → `DELETE /api/admin/users/:id`.
- **Server rules:** admin accounts cannot be deleted; deleting a provider also deletes their bikes
  (their past bookings stay for records).
- **List:** 12 per page, role filter and search; verification badge per user. Confirmations and errors use SweetAlert (`utils/alerts.js`).
