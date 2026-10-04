# Expense Tracker

Log expenses and watch the backend compute totals and per-category breakdowns.

- `GET /api/expenses` — list expenses + aggregated stats
- `POST /api/expenses` — body `{ label, amount, category }`
- `DELETE /api/expenses?id=...`

All aggregation (total, per-category sums and percentages) happens in
`api/expenses.js` on the server; the frontend just renders the numbers it's given.
