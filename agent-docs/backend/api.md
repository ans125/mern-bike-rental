# API endpoints

Back to [index](../../CLAUDE.md) · Interactive docs: `http://localhost:5000/api-docs` (Swagger)

Auth: **public** · **optional** (`optionalAuth`) · **login** (`protect`) · **provider** (`protect` + `providerOnly`, approved) · **admin**

## Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/auth/captcha` | public | `{ question, token }` — token holds an HMAC of the answer, 10 min |
| POST | `/api/auth/register` | public | **multipart**: role, name, email, phone, password, cnic, city, address, licenseNumber (customer) / shopName (provider), `cnicFront`, `cnicBack`, captchaToken, captchaAnswer → account with `isApproved: false` |
| POST | `/api/auth/login` | public | → profile + `isApproved`, `verificationStatus`, `verificationNote`, token |
| GET | `/api/auth/me` | login | fresh profile |

## Bikes
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/bikes` | public | available bikes |
| GET | `/api/bikes/:id` | public | one bike with reviews |
| GET | `/api/bikes/my/bikes` | provider | own bikes |
| POST / PUT / DELETE | `/api/bikes`, `/api/bikes/:id` | provider | owner only; fields incl. category, description, isAvailable |
| POST | `/api/bikes/:id/reviews` | login | only after the renter **picked up** the bike (`ongoing`/`completed`), once |

## Bookings
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/bookings` | login | customers only, **verified** account, start ≥ today, ≤ 30 days, bike available, no overlap with pending/approved/ongoing |
| GET | `/api/bookings/my` | login | renter's list (no chat) |
| GET | `/api/bookings/provider` | provider | owner's list (no chat) |
| GET | `/api/bookings/admin` | admin | all |
| GET | `/api/bookings/:id` | renter / owner / admin | details; contacts only after acceptance |
| POST | `/api/bookings/:id/messages` | renter / owner | `{ text }`, after acceptance |
| PUT | `/api/bookings/:id/status` | owner / admin | `{ status: approved \| rejected }` from pending |
| PUT | `/api/bookings/:id/pickup` | provider (owner) | owner confirms hand-over: `approved` → `ongoing` |
| PUT | `/api/bookings/:id/return` | provider (owner) | `ongoing` → `completed` |
| PUT | `/api/bookings/cancel/:id` | renter / owner / admin | only `pending` or `approved` |

## Admin (all admin, under `/api/admin`)
`GET /users` · `DELETE /users/:id` · `GET /verifications?status=pending|approved|rejected` · `PUT /users/:id/approve` ·
`PUT /users/:id/reject { reason }` · `GET /users/:id/documents/:side` (cnicFront|cnicBack image) · `GET /bikes` ·
`DELETE /bikes/:id` · `GET /bookings` · `GET /stats` (counts, revenue, platformEarnings, pendingVerifications, openMessages,
`monthly[6]`, `bookingsByStatus`) · `GET /messages` · `PUT /messages/:id`

## Support & other
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/support` | optional | contact form ticket |
| POST | `/api/chat` | optional | AI customer support |
| POST | `/api/upload` | provider | bike photo jpg/png ≤ 5 MB |
