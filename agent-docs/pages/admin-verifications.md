# Admin – Verifications — `/admin/verifications`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Admin/AdminVerifications.jsx` · **Guard:** `AdminRoute` · old `/admin/providers` redirects here.
- **Tabs:** Pending / Approved / Rejected → `GET /api/admin/verifications?status=…` (customers **and** providers).
- **Filters:** role, search (name, email, CNIC, city, shop); 10 per page.
- **Review modal:** all KYC fields + CNIC front/back images loaded with the admin token from
  `GET /api/admin/users/:id/documents/:side` (blob URLs — documents are never public files).
- **Actions:** Approve → `PUT /api/admin/users/:id/approve`; Reject (SweetAlert asks for a reason, shown to the user) →
  `PUT /api/admin/users/:id/reject`; Delete → `DELETE /api/admin/users/:id`.
