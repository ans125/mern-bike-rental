# Layout, header, footer & route guards

Back to [index](../../CLAUDE.md)

## App shell — `client/src/App.jsx`
- `main.jsx` wraps `<App/>` in `BrowserRouter`; Bootstrap + slick CSS imported globally.
- `Header`, `Footer` and the AI `CustomerSupport` chat widget render on every route **except** paths starting with
  `/admin` or `/provider` (those use their own layouts with a sidebar).

## Header — `components/Header.jsx`
- Brand "RideRent", links: Home, Browse Bikes, Become a Provider (logged-out only → `/register?role=provider`), About, Contact.
- Logged in: avatar dropdown with Dashboard (role-based link) and Logout (`clearStoredUser()` → `/login`).
- Reads the user with `getStoredUser()` on every render (App re-renders on route change, so it stays in sync).

## Footer — `components/Footer.jsx`
- Static links + GSAP scroll animation. Includes a link to the public project overview page.

## Dashboard layouts
- `components/Admin/AdminLayout.jsx` + `AdminSidebar.jsx` — Dashboard, Users, Verifications, Bikes, Bookings, Support Messages, Logout.
- `components/Provider/ProviderLayout.jsx` + `ProviderSidebar.jsx` — Dashboard, My Bikes, Add Bike, Bookings, Logout.

## Route guards — `client/src/routes/`
| Guard | Rule |
|---|---|
| `ProtectedRoute` | not logged in → `/login`; admin/provider → their own dashboard (renter pages only) |
| `ProviderRoute` | not logged in → `/login`; role ≠ provider → `/` |
| `AdminRoute` | not logged in → `/login`; role ≠ admin → `/` |

Guards only read `localStorage`, so they are UX only. Real security = server middleware
([auth & roles](../backend/auth-and-roles.md)).
