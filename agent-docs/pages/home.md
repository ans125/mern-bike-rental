# Home — `/`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Home.jsx` · **Access:** public
- **Sections:** hero with "Browse Bikes"; **Browse by city** and **Browse by bike type** buttons that open
  `/bike?city=…` / `/bike?category=…`; **Top Rated Bikes** slider; the support chat button (mounted in `App.jsx`).
- **Slider:** `components/BikeSlider.jsx` (react-slick) loads `GET /api/bikes` and shows the 10 best-rated bikes.
- **Related:** [Browse Bikes](browse-bikes.md), [Chatbot](../frontend/chatbot.md)
