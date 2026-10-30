# Register — `/register` (`/register?role=provider`)

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Auth/Register.jsx` · **Access:** public · sends **multipart** `FormData` to `POST /api/auth/register`.
- Required fields show a red `*`. Role cards: **Customer** or **Bike Provider (Vendor)**.

| Field | Customer | Provider | Rule |
|---|---|---|---|
| Full name (as on CNIC) | * | * | |
| Email | * | * | unique |
| Mobile number | * | * | `03XX-XXXXXXX` (auto-formatted); shown to the other side after a booking is accepted |
| CNIC number | * | * | `12345-1234567-1` (auto-formatted), unique |
| City | * | * | Pakistani city list (`constants/cities.js`) |
| Driving licence number | * | — | |
| Shop / business name | — | * | |
| Address | * home | * shop = pick-up location | |
| CNIC front + back images | * | * | JPG/PNG ≤ 3 MB, stored privately |
| Password + confirm | * | * | ≥ 8 chars, letters + numbers |
| Human verification | * | * | dynamic math question from `GET /api/auth/captcha`, refresh button |
| Terms checkbox | * | * | |

- After signup the user is logged in with `isApproved: false` (verification pending) and sent to their dashboard.
  Customers can browse but not book; providers cannot list bikes until the admin approves the CNIC
  ([Admin – Verifications](admin-verifications.md)).
