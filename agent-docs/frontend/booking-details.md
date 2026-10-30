# Booking details & safe hand-over — `components/BookingDetailsModal.jsx`

Back to [index](../../CLAUDE.md)

Opened from the customer dashboard ("Details") and provider bookings ("Hand over" / "Return" / "Details").
Loads `GET /api/bookings/:id`.

| Part | Shown when | Content |
|---|---|---|
| Progress | not cancelled/rejected | Requested → Accepted → Picked up → Returned |
| Contact card | after acceptance (`contactShared`) | other party's name/shop, phone (`tel:` link), email; provider also sees the customer's licence no. |
| Location | after acceptance | provider's shop address (text only), pick-up/return times |
| Hand over button | provider, status `approved` | confirm pop-up → `PUT /api/bookings/:id/pickup` → `ongoing` |
| Mark returned | provider, status `ongoing` | `PUT /api/bookings/:id/return` → `completed` |
| Safety checklist | active bookings | role-specific steps (meet at shop, check original CNIC/licence, photos, pay at hand-over) |
| Chat | after acceptance | `POST /api/bookings/:id/messages`, refresh button |

Before acceptance only names/cities are visible and the chat is closed — personal numbers stay private.
