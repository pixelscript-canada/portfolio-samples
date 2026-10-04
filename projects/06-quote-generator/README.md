# Quote Generator

Fetch a random quote from the backend and save favorites server-side.

- `GET /api/quote` — a random quote
- `GET /api/favorites` — list saved favorites
- `POST /api/favorites` — body `{ id }`, saves a quote by id
- `DELETE /api/favorites?id=...` — removes a favorite
