# Home — `/`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Home.jsx` · **Access:** public
- **Purpose:** landing page — hero text, "Browse Bikes" buttons, slider of popular bikes, floating AI chatbot.
- **Components:** `components/BikeSlider.jsx` (react-slick carousel), `components/Chatbot/ChatButton.jsx`.
- **API:** `BikeSlider` → `getAllBikes()` → `GET /api/bikes`. Card click → `/bike/:id`.
- **Related:** [Browse Bikes](browse-bikes.md), [Chatbot](../frontend/chatbot.md)
