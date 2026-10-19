# Database models (MongoDB / Mongoose)

Back to [index](../../CLAUDE.md)

All models have `createdAt` / `updatedAt` (timestamps).

## User — `server/models/User.js` → collection `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| phone | String | default `""` |
| password | String | bcrypt hash, never returned by `protect` |
| role | `admin` \| `provider` \| `user` | default `user` |
| isApproved | Boolean | `true` for users on signup; providers start `false` |

## Bike — `server/models/bikeModel.js` → collection `bikes`
| Field | Type | Notes |
|---|---|---|
| provider | ObjectId → User | required, owner |
| name, brand, city | String | required |
| rentPerDay | Number | PKR, required |
| image | String | required; URL or `/uploads/...` path |
| rating, numReviews | Number | computed from `reviews` |
| reviews | [{ user, name, rating, comment }] | embedded |

> Some older seeded documents also contain `isAvailable` — it is not in the schema and not used.

## Booking — `server/models/Booking.js` → collection `bookings`
| Field | Type | Notes |
|---|---|---|
| bike | ObjectId → Bike | required |
| user | ObjectId → User | renter |
| provider | ObjectId → User | copied from the bike |
| startDate, endDate | Date | required |
| totalPrice | Number | calculated on the server |
| status | `pending` \| `approved` \| `cancelled` | default `pending`; `approved` not used yet |

## Relationships
User (provider) 1 — * Bike 1 — * Booking * — 1 User (renter)
