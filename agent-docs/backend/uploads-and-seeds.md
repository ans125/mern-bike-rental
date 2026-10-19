# Uploads & seed scripts

Back to [index](../../CLAUDE.md)

## Image uploads — `middleware/uploadMiddleware.js`, `routes/uploadRoutes.js`
- Multer disk storage into `server/uploads/` (folder is created automatically). File name = `Date.now()` + extension.
- Only jpg / jpeg / png (checked by extension and mimetype). No size limit set.
- `server.js` serves the folder at `/uploads`. The client builds full URLs with `resolveBikeImageUrl()`.
- Images live on the server's disk — back them up, and use cloud storage (e.g. Cloudinary) if deploying to a host
  that wipes the disk on restart.

## Seed scripts (run from `server/`)
| Script | Creates |
|---|---|
| `node seedUsers.js` | admin, provider and user accounts `@example.com`, all approved (skips existing emails) |
| `node seedBikes.js` | 5 demo bikes (Honda, Yamaha, Suzuki, Benelli…) owned by `provider@example.com` |

Both read `MONGO_URI` from `server/.env`. Demo passwords are in `seedUsers.js` — change them before any real deployment.
