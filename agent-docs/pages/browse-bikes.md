# Browse Bikes — `/bike`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Bike/Bike.jsx` · **Access:** public
- **API:** `getAllBikes()` → `GET /api/bikes` (available bikes only), loaded once; all filtering is in the browser.
- **Filters:** text search (name + brand), city (built from the data), bike type chips (`constants/bikeCategories.js`),
  max rent/day slider (up to the highest price), brand checkboxes with counts, **Reset**.
- **Sort:** top rated (rating, then review count), price low→high, high→low, newest.
- **Paging:** 12 cards, then "Load more bikes"; result count line ("Showing 12 of 95 bikes in Lahore").
- **URL params:** `/bike?city=Lahore&category=125cc` pre-selects filters (used by home page shortcuts).
- **Cards:** image (demo commuter image uses `object-fit: contain`), type badge, rating with review count or "New",
  city · brand, rent per day.
