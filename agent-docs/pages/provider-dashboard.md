# Provider Dashboard — `/provider/dashboard`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderDashboard.jsx` · **Guard:** `ProviderRoute` · **Layout:** `ProviderLayout`
- **On load:** `refreshStoredUser()` → `GET /api/auth/me` to get the latest `isApproved`, so an approval shows up
  without logging out. If approved: `getMyBikes()` + `getProviderBookings()` fill the stat cards.
- **Cards:** Total Bikes, Active Bookings (not cancelled, end date today or later), Account Status.
- **Not approved:** yellow "Account Pending Approval" alert; counts stay `--` because the server blocks provider APIs
  (`providerOnly` returns 403 until approved).
