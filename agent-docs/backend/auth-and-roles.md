# Auth, roles, verification & hand-over

Back to [index](../../CLAUDE.md)

## Login
bcrypt check → JWT `{ id, role }` (30 days) → stored in `localStorage["user"]`, sent as `Bearer` token.

## Middleware
| Name | Does |
|---|---|
| `protect` | 401 if no/invalid token or user deleted |
| `optionalAuth` | identifies the user if a token is sent (chat, support form) |
| `adminOnly` | 403 unless admin |
| `providerOnly` | 403 unless provider **and** `isApproved` |

## Verification (KYC)
1. Signup uploads CNIC front/back (multer `kycUpload` → `server/private/kyc`, random UUID names, ≤ 3 MB, jpg/png) and passes a
   dynamic captcha (`utils/captcha.js`: HMAC of the answer inside a signed 10-minute token).
2. Every new customer and provider starts `isApproved: false`, `verificationStatus: "pending"`.
3. Admin reviews in `/admin/verifications` (documents streamed only to admins) → approve, or reject with a reason.
4. Customers need approval to **book**; providers need approval to **add bikes / see bookings**.

## Booking life cycle & safe hand-over
`pending` → owner accepts → `approved` (phones, shop address and chat unlocked)
→ customer meets at the shop with original CNIC + licence → owner presses **Hand over** → `ongoing` → bike returned → owner marks
returned → `completed` → customer can review. Owner may reject a pending request (`rejected`); renter/owner/admin may cancel
before pick-up (`cancelled`). Only pending/approved/ongoing bookings block dates; approved/ongoing/completed count as earnings.

## Rules a rental shop would enforce
Customers only can book · verified accounts only · no past dates · max 30 days · no overlapping bookings · unavailable bikes
cannot be booked · reviews only after pick-up · KYC images never public.
