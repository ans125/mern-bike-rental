# Admin – Support Messages — `/admin/messages`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Admin/AdminMessages.jsx` · **Guard:** `AdminRoute`
- **API:** `getSupportMessages()` → `GET /api/admin/messages`; `updateSupportMessage(id, "open" | "resolved")` →
  `PUT /api/admin/messages/:id`.
- **Shows:** sender (mailto link), subject, message, received time, Open/Resolved badge, Resolve / Reopen button.
- The admin replies by email outside the app, then marks the ticket resolved.
- **List:** 8 per page, Open/Resolved/All filter. Confirmations and errors use SweetAlert (`utils/alerts.js`).
