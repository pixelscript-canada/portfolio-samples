# Markdown Notes

A notes app where rendering happens on the server, not the client.

- `POST /api/render` — body `{ markdown }`, returns `{ html }`
- `GET /api/notes` / `POST /api/notes` — save and list notes (in-memory)

The backend ships a small hand-written Markdown → HTML converter (headings,
bold/italic, lists, links, code blocks, blockquotes) — no client-side
Markdown library needed.
