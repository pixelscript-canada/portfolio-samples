# Password Toolkit (Ruby backend)

Generate cryptographically-random passwords and score password strength,
both computed server-side.

- `GET /api/generate?length=16&symbols=1&numbers=1&upper=1` — a random password
  built with Ruby's `SecureRandom` (not a seeded PRNG)
- `GET /api/score?password=...` — returns an entropy estimate and a 0-4
  strength score

The backend runs on Vercel's native Ruby runtime (`Handler = Proc.new do
|request, response| ... end`), no gems beyond the standard library.
