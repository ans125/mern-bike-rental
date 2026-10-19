# Auth, roles & approval

Back to [index](../../CLAUDE.md)

## How login works
1. `POST /api/auth/login` checks the bcrypt password hash.
2. Server signs a JWT `{ id, role }` with `JWT_SECRET`, valid **30 days** (`utils/generateToken.js`).
3. Client stores the response in `localStorage["user"]`; Axios sends `Authorization: Bearer <token>` on every request.

## Middleware — `server/middleware/authMiddleware.js`
| Name | Does |
|---|---|
| `protect` | 401 if no/invalid token or the user no longer exists; sets `req.user` (without password) |
| `adminOnly` | 403 unless `req.user.role === "admin"` |
| `providerOnly` | 403 unless role is provider **and** `isApproved` (message "Provider account pending admin approval") |

## Roles
| Role | How created | Can |
|---|---|---|
| user | self-register | browse, book, cancel own bookings, review |
| provider | self-register → admin approves | add/edit/delete own bikes, see bookings of own bikes, cancel them |
| admin | **only** `server/seedUsers.js` | everything under `/api/admin`, cancel any booking |

Self-registering with `role: "admin"` returns 400 "Invalid role".

## Provider approval flow
Register as provider → `isApproved: false` → dashboard shows "Pending Approval", provider APIs return 403 →
admin clicks Approve in `/admin/providers` → next dashboard load calls `GET /api/auth/me` and unlocks.
