# Provider Dashboard — `/provider/dashboard`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Provider/ProviderDashboard.jsx` · **Guard:** `ProviderRoute`
- Refreshes the profile (`GET /api/auth/me`); shows a pending or rejected (with reason) verification banner.
- **Cards:** Total Bikes, Requests Waiting, To Hand Over (accepted), Bikes on Ride, My Earnings (90% of accepted +
  on-ride + completed bookings), Account Status.
