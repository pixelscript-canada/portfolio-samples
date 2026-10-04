# Password Toolkit

Generate cryptographically-random passwords and score password strength,
both computed server-side.

- `GET /api/generate?length=16&symbols=1&numbers=1&upper=1` — a random password
  built with Node's `crypto.randomInt` (not `Math.random`)
- `POST /api/score` — body `{ password }`, returns an entropy estimate and a
  0-4 strength score
