# Expense Tracker (Go backend)

Log expenses and watch the backend compute totals and per-category breakdowns.

- `GET /api/expenses` — list expenses + aggregated stats
- `POST /api/expenses` — body `{ label, amount, category }`
- `DELETE /api/expenses?id=...`

All aggregation (total, per-category sums and percentages) happens in
`api/expenses.go` on the server; the frontend just renders the numbers it's given.

The backend runs on Vercel's native Go runtime — a single statically-typed
`Handler(w http.ResponseWriter, r *http.Request)` function, no framework.
