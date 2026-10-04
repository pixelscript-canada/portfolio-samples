# Currency Converter (PHP backend)

Converts between currencies using live exchange rates fetched server-side.

- `GET /api/convert?from=USD&to=CAD&amount=100` — the backend fetches current
  rates from the free [open.er-api.com](https://www.exchangerate-api.com/docs/free)
  API (no key required) and returns the converted amount.

The backend (`api/convert.php`) runs on Vercel via the community
[vercel-php](https://github.com/vercel-community/php) runtime, plain PHP
with no framework.
