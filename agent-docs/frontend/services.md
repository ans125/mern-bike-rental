# Services & API client

Back to [index](../../CLAUDE.md)

## `client/src/api/axios.js`
- `API_BASE_URL` = `import.meta.env.VITE_API_URL` or `http://localhost:5000/api`.
- `API_ORIGIN` = base URL without `/api` (used for image URLs).
- Request interceptor adds `Authorization: Bearer <token>` from `localStorage["user"]`.

## `client/src/services/`
| File | Functions → endpoint |
|---|---|
| `authService.js` | `login` → `POST /auth/login` · `register` → `POST /auth/register` · `refreshStoredUser` → `GET /auth/me` · `getStoredUser` / `storeUser` / `clearStoredUser` (localStorage helpers) |
| `bikeService.js` | `getAllBikes` → `GET /bikes` · `getBikeById` → `GET /bikes/:id` · `getMyBikes` → `GET /bikes/my/bikes` · `addBike` → `POST /bikes` · `updateBike` → `PUT /bikes/:id` · `deleteBike` → `DELETE /bikes/:id` · `addReview` → `POST /bikes/:id/reviews` · `resolveBikeImageUrl(image)` |
| `bookingService.js` | `createBooking` → `POST /bookings` · `getMyBookings` → `GET /bookings/my` · `getProviderBookings` → `GET /bookings/provider` · `cancelBooking` → `PUT /bookings/cancel/:id` |
| `adminService.js` | `getAdminStats`, `getUsers`, `deleteUser`, `getPendingProviders`, `approveProvider`, `getAllBikes`, `deleteBike`, `getAllBookings` → `/admin/*` |

Image upload is called directly with `api.post("/upload", formData)` in `ProviderAddBike.jsx`.
The chatbot uses `api.post("/chat", { message })`.
