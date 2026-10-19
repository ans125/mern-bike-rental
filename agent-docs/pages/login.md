# Login — `/login`

Back to [index](../../CLAUDE.md)

- **File:** `client/src/pages/Auth/Login.jsx` · **Access:** public
- **Flow:** email + password + "I'm not a robot" checkbox → `login()` → `POST /api/auth/login`.
  Response `{ _id, name, email, phone, role, isApproved, token }` is saved to `localStorage["user"]`.
- **Redirect by role:** admin → `/admin/dashboard`, provider → `/provider/dashboard`, user → `/user/dashboard`.
- **Errors:** server message shown in a red alert (e.g. "Invalid email or password").
- **Related:** [Register](register.md), [auth & roles](../backend/auth-and-roles.md)
