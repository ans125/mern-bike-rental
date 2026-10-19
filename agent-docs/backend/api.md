# API endpoints

Back to [index](../../CLAUDE.md) · Interactive docs: `http://localhost:5000/api-docs` (Swagger)

Auth column: **public** · **login** (`protect`) · **provider** (`protect` + `providerOnly`, approved) · **admin** (`protect` + `adminOnly`)

## Auth — `routes/authRoutes.js` → `controllers/authController.js`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | public | body `{ name, email, password (≥6), phone?, role? }`; role must be `user` or `provider` |
| POST | `/api/auth/login` | public | body `{ email, password }` → `{ _id, name, email, phone, role, isApproved, token }` |
| GET | `/api/auth/me` | login | current profile (fresh `isApproved`) |

## Bikes — `routes/bikeRoutes.js` → `controllers/bikeController.js`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/bikes` | public | all bikes + provider name/email |
| GET | `/api/bikes/:id` | public | one bike |
| GET | `/api/bikes/my/bikes` | provider | my bikes |
| POST | `/api/bikes` | provider | `{ name, brand, city, rentPerDay, image }` |
| PUT | `/api/bikes/:id` | provider | owner only |
| DELETE | `/api/bikes/:id` | provider | owner only |
| POST | `/api/bikes/:id/reviews` | login | `{ rating, comment }`, one review per user |

## Bookings — `routes/bookingRoutes.js` → `controllers/bookingController.js`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/bookings` | login | `{ bikeId, startDate, endDate }`; rejects end < start and overlaps; price = max(1, days) × rent |
| GET | `/api/bookings/my` | login | my bookings |
| GET | `/api/bookings/provider` | provider | bookings for my bikes |
| GET | `/api/bookings/admin` | admin | all bookings |
| PUT | `/api/bookings/cancel/:id` | login | renter, the bike's provider, or admin; not twice |

## Admin — `routes/adminRoutes.js` → `controllers/adminController.js` (all **admin**)
`GET /api/admin/users` · `DELETE /api/admin/users/:id` (not admins; provider → their bikes deleted) ·
`GET /api/admin/providers/pending` · `PUT /api/admin/providers/:id/approve` · `GET /api/admin/bikes` ·
`DELETE /api/admin/bikes/:id` · `GET /api/admin/bookings` · `GET /api/admin/stats`

## Other
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/upload` | provider | multipart field `image` (jpg/jpeg/png) → text `/uploads/<timestamp>.<ext>` |
| POST | `/api/chat` | public | `{ message }` → `{ reply }` (Gemini) |
| GET | `/uploads/<file>` | public | static images |

Errors are JSON `{ message }`. A final error handler in `server.js` converts thrown errors (e.g. Multer) to JSON.
