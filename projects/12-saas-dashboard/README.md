# Orbit Analytics — SaaS Dashboard

A three-page admin dashboard in the style of a real SaaS product: an
overview with KPIs and a revenue chart, a searchable/sortable/paginated
customer table, and a settings page that actually persists.

- `GET /api/overview` — KPIs (MRR, active customers, churn, ARPA) and a
  30-day revenue series, all computed server-side from the customer dataset
- `GET /api/customers` — search (`?q=`), filter (`?status=`), sort
  (`?sort=field:asc|desc`) and pagination (`?page=&perPage=`), all handled
  server-side, not client-side array filtering
- `GET/POST /api/settings` — reads and writes real settings; reload the page
  and your changes are still there

The ~64 customers and the revenue history are generated with a seeded PRNG
(`api/_rng.js`) rather than stored in a database — same seed in, same data
out, on every request, so pagination and sorting stay consistent without
needing persistent storage. Chart rendered with Chart.js; everything else is
plain HTML/CSS/JS.
