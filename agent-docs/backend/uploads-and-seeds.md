# Uploads & seed scripts

Back to [index](../../CLAUDE.md)

## Image uploads — `middleware/uploadMiddleware.js`, `routes/uploadRoutes.js`
- Multer disk storage into `server/uploads/` (created automatically). File name = `Date.now()` + extension.
- Only jpg / jpeg / png. `server.js` serves the folder at `/uploads`; the client builds URLs with `resolveBikeImageUrl()`.
- `server/uploads/demo/commuter-125.png` is the shared photo for demo commuter bikes (70–125cc).
- **Per-model photos:** put `server/uploads/bikes/<model-slug>.jpg` (list: `node seedDemoData.js --image-names`), re-run the seed.
  Models without their own photo reuse a local photo from the same category (`SIMILAR_CATEGORY` fills gaps, e.g.
  100-110cc → 70cc/125cc); Unsplash/`commuter-125.png` are used only if a category has no local photo at all.
  Currently 15 of 38 models have their own photo.
- **Identity documents:** `server/private/kyc/` (gitignored, never served statically); demo accounts use the shared
  `demo-cnic-front.svg` / `demo-cnic-back.svg` sample cards created by the seed.

## Seed scripts (run from `server/`)
| Script | Does |
|---|---|
| `node seedUsers.js` | base accounts `admin@example.com`, `provider@example.com`, `user@example.com` |
| `node seedBikes.js` | 5 bikes for `provider@example.com` |
| `node seedDemoData.js` | **large demo data set** (see below); safe to re-run |
| `node seedDemoData.js --reset` | removes only the demo data |

### `seedDemoData.js`
- Removes previous demo records first (everything linked to `@demo.riderent.pk` accounts), then inserts:
  10 providers (8 approved in Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Sialkot; 2 pending
  in Quetta and Hyderabad), 12 customers, ~95 bikes from 38 Pakistani models (Honda CD 70 … Kawasaki Ninja 650, Jolta
  electric) with categories, ~680 bookings over 6 months in every status (completed, on ride, accepted with chat,
  pending, rejected, cancelled), ~200 reviews, 5 support messages. Also 2 pending + 1 rejected customer and 1 rejected provider
  for verification testing. All demo users have CNIC, city, address and licence/shop details.
- Also creates the three base accounts if they are missing.
- Deterministic (same data each run). Demo password: `demo1234`. Base account password: see `seedUsers.js`.
- Accounts are listed in [setup.md](../project/setup.md#test-accounts).
