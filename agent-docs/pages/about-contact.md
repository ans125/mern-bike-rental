# About — `/about` · Contact & Support — `/contact`

Back to [index](../../CLAUDE.md)

- **About:** `client/src/pages/About.jsx` — static text + image with a GSAP fade-in. No API.
- **Contact:** `client/src/pages/Contact.jsx` — support form (name, email, subject dropdown, message ≤ 2000 chars),
  contact details, FAQ accordion. Name/email are pre-filled for logged-in users.
- **API:** `sendSupportMessage()` → `POST /api/support` (public; links the ticket to the user if logged in).
  Tickets appear in [Admin – Support Messages](admin-messages.md).
- Linked from the header ("Contact") and from the support chat ("Contact our team").
