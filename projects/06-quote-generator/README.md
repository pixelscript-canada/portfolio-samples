# Quote Generator (Python backend)

Fetch a random quote from the backend and save favorites server-side.

- `GET /api/quote` — a random quote
- `GET /api/favorites` — list saved favorites
- `POST /api/favorites` — body `{ id }`, saves a quote by id
- `DELETE /api/favorites?id=...` — removes a favorite

The backend runs on Vercel's native Python runtime using only the standard
library (`http.server`, `json`) — no dependencies to install.
