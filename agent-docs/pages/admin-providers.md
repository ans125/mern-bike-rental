# Admin – Providers — `/admin/providers`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Admin/AdminProviders.jsx` · **Guard:** `AdminRoute`
- **Tabs:** "Pending" (`GET /api/admin/providers/pending`) and "Active Providers" (approved, filtered from `GET /api/admin/users`).
- **Actions:** Approve → `PUT /api/admin/providers/:id/approve` (sets `isApproved: true`); Reject/Delete → `DELETE /api/admin/users/:id`.
