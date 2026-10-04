# URL Shortener

Turns a long URL into a short code and redirects visitors server-side.

- `POST /api/shorten` — body `{ url }`, returns `{ code, shortUrl }`
- `GET /api/go?code=...` — 302-redirects to the original URL
- `GET /api/stats` — list all shortened links with click counts

All three routes are handled by a single serverless function
(`api/[...action].js`) so they share the same in-memory store — Vercel's
zero-config Node runtime only resolves single path segments under `api/`
reliably without a framework, so the code is passed as `?code=...` rather
than as a second path segment.

State lives in memory on the serverless function for the demo; a production
version would swap this for Redis/Postgres without changing the frontend.
