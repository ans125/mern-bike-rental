# Services & API client

Back to [index](../../CLAUDE.md)

## `client/src/api/axios.js`
- `API_BASE_URL` = `import.meta.env.VITE_API_URL` or `http://localhost:5000/api`; `API_ORIGIN` = without `/api`.
- Request interceptor adds `Authorization: Bearer <token>` from `localStorage["user"]`.

## `client/src/services/`
| File | Functions → endpoint |
|---|---|
| `authService.js` | `login` → `POST /auth/login` · `register(formData)` → `POST /auth/register` (multipart) · `getCaptcha` → `GET /auth/captcha` · `refreshStoredUser` → `GET /auth/me` · `getStoredUser` / `storeUser` / `clearStoredUser` |
| `bikeService.js` | `getAllBikes` → `GET /bikes` · `getBikeById` · `getMyBikes` → `GET /bikes/my/bikes` · `addBike` · `updateBike` → `PUT /bikes/:id` · `deleteBike` · `addReview` → `POST /bikes/:id/reviews` · `resolveBikeImageUrl(image)` |
| `bookingService.js` | `createBooking` · `getMyBookings` · `getProviderBookings` · `cancelBooking` → `PUT /bookings/cancel/:id` · `updateBookingStatus(id, status)` → `PUT /bookings/:id/status` · `getBookingDetails` → `GET /bookings/:id` · `sendBookingMessage` → `POST /bookings/:id/messages` · `confirmPickup(id)` → `PUT /bookings/:id/pickup` · `confirmReturn` → `PUT /bookings/:id/return` |
| `adminService.js` | `getAdminStats`, `getUsers`, `deleteUser`, `getVerifications(status)`, `approveUser`, `rejectUser(id, reason)`, `getUserDocument(id, side)` (blob), `getAllBikes`, `deleteBike`, `getAllBookings`, `getSupportMessages`, `updateSupportMessage` → `/admin/*` |
| `supportService.js` | `sendSupportMessage` → `POST /support` · `askSupportAssistant(message, history)` → `POST /chat` |

Image upload is called directly with `api.post("/upload", formData)` in `ProviderAddBike.jsx` and `ProviderBikes.jsx`.

## Shared pieces
- `components/StatusBadge.jsx` — Pending, Accepted, On ride, Completed, Rejected, Cancelled, Not picked up (accepted but end date passed).
- `components/BookingDetailsModal.jsx` — see [booking-details.md](booking-details.md).
- `hooks/usePagination.js` + `components/TablePagination.jsx` — client-side paging for every list (pass a memoized array).
- `utils/alerts.js` — SweetAlert2 wrappers: `confirmAction`, `askText`, `showSuccess`, `showError`, `showInfo`, `apiError`.
  **Never use `window.alert` / `window.confirm`.**
- `constants/bikeCategories.js`, `constants/cities.js` — shared option lists.
