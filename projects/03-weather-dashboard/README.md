# Weather Dashboard (Python backend)

Search any city and get current conditions plus a 5-day forecast.

- `GET /api/weather?city=...` — the backend geocodes the city name and fetches
  the forecast from the free [Open-Meteo](https://open-meteo.com) API (no key
  required), then returns a single clean JSON payload to the frontend.

Proxying through our own API avoids exposing a third-party API shape to the
client and sidesteps CORS entirely.

The backend (`api/weather.py`) runs on Vercel's native Python runtime, using
only the standard library (`urllib`) — no dependencies to install.
