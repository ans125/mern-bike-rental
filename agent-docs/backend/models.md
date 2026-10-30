# Database models (MongoDB / Mongoose)

Back to [index](../../CLAUDE.md)

## User — `users`
| Field | Notes |
|---|---|
| name, email (unique), phone `03XX-XXXXXXX`, password (bcrypt) | |
| role | `admin` \| `provider` \| `user` |
| cnic `12345-1234567-1`, city, address | address = shop pick-up location for providers |
| licenseNumber | customers |
| shopName | providers |
| documents.cnicFront / cnicBack | file names in `server/private/kyc` (not public) |
| isApproved, verificationStatus (`pending`/`approved`/`rejected`), verificationNote | set by admin; **access checks use `isApproved`** |

## Bike — `bikes`
provider → User, name, brand, city, rentPerDay, image, description, category, isAvailable, rating, numReviews, reviews[].

## Booking — `bookings`
| Field | Notes |
|---|---|
| bike, user, provider | |
| startDate, endDate, totalPrice, commission (10%), providerEarning | |
| status | `pending` → `approved` / `rejected` → `ongoing` → `completed`; `cancelled` from pending/approved |
| pickedUpAt, returnedAt | set by pick-up / return |
| messages[] | `{ sender, senderName, text, createdAt }` chat between renter and owner |

## SupportMessage — `supportmessages`
name, email, subject, message, user?, status `open`/`resolved`.
