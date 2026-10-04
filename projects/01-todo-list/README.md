# Todo List API

A small task manager with full CRUD backed by a real serverless API.

- `GET /api/todos` — list todos
- `POST /api/todos` — create a todo `{ title }`
- `PATCH /api/todos?id=...` — toggle/rename a todo
- `DELETE /api/todos?id=...` — delete a todo

The frontend (`index.html` + `script.js`) is plain HTML/CSS/JS — no framework,
no build step. The API lives in `api/todos.js` and keeps state in memory for
the lifetime of the serverless instance (this is a demo, not a production
database).
