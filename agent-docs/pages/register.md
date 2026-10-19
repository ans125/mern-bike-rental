# Register — `/register` (`/register?role=provider`)

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Auth/Register.jsx` · **Access:** public
- **Fields:** role radio (User / Bike Provider), full name, email, phone, password (≥ 6 chars), captcha "5 + 4".
  `?role=provider` pre-selects provider (used by the "Become a Provider" header link).
- **API:** `register()` → `POST /api/auth/register` with `{ name, email, phone, password, role }`. The user is logged in
  immediately (stored in localStorage) and sent to their dashboard.
- **Approval:** `user` accounts are approved automatically; `provider` accounts start with `isApproved: false` until an
  admin approves them in [Admin – Providers](admin-providers.md). Role `admin` is rejected by the server.
- **History:** before 2026-10-19 this page only showed an alert, and had ID-card upload fields that were never saved;
  those fields were removed.
