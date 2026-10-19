# Documentation maintenance (do this after every change)

Back to [index](../../CLAUDE.md)

Docs must stay in sync with the code. When you change something, update **in the same commit**:

| You changed… | Update |
|---|---|
| A page / component | its file in `agent-docs/pages/` or `agent-docs/frontend/` |
| A route, controller or model | `agent-docs/backend/*.md` **and** `internal-docs/backend-guide.html` (private) |
| A user-visible feature, role or flow | `client/public/project-overview.html` (public) |
| Added a page | new `agent-docs/pages/<name>.md` + a row in the index table in `CLAUDE.md` |
| Anything | one line in [changelog.md](changelog.md) (newest first, `YYYY-MM-DD`) |

Both HTML docs show a **"Last updated"** date near the top — change it whenever you edit them.

## Public vs private
- Public (committed): `CLAUDE.md`, `agent-docs/**`, `README.md`, `client/public/project-overview.html`.
- Private (gitignored): `internal-docs/**` (backend team guide), `.env` files, `*.docx`.
- Never put passwords, keys, real connection strings or personal data in any public doc.
