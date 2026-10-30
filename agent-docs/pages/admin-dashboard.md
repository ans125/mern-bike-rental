# Admin Dashboard — `/admin/dashboard`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/dashboards/AdminDashboard.jsx` · **API:** `GET /api/admin/stats`
- **Cards:** customers, providers, bikes, bookings, rental revenue, platform earnings (10%), pending verifications,
  open support messages (cards link to their pages).
- **Charts (Recharts):** *Rental revenue* — column chart of the last 6 months (`stats.monthly`, by pick-up month; tooltip shows
  commission and booking count); *Bookings by status* — horizontal bars (`stats.bookingsByStatus`) with values at the tips.
  Single brand-green series, recessive grid, each chart has a **Table** toggle with the same numbers.
- **Data flow:** `getAdminStats()` (`services/adminService.js`) → `GET /api/admin/stats` (`protect` + `adminOnly`) →
  `adminController.getAdminStats` runs counts + aggregation pipelines in `Promise.all` → JSON → `<BarChart>` components.
  Revenue / earnings / monthly only count `EARNING_STATUSES` (approved, ongoing, completed); months with no bookings are
  filled with 0 on the server, so the chart always shows 6 bars.
