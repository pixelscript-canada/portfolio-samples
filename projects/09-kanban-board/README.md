# Kanban Board

Drag-and-drop task board where column state is persisted via the API.

- `GET /api/board` — the three columns and their cards
- `POST /api/cards` — body `{ column, title }`, adds a card
- `PATCH /api/cards?id=...` — body `{ column }`, moves a card to another column
- `DELETE /api/cards?id=...` — removes a card
