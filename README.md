# Portfolio Samples

Ten small full-stack demo projects. Each one has its own frontend (plain HTML/CSS/JS)
and a real backend (Vercel serverless functions under `api/`), is independently
deployable, and lives in its own folder so the source is easy to browse.

| # | Project | Folder | Stack |
|---|---------|--------|-------|
| 1 | Todo List API | [`projects/01-todo-list`](projects/01-todo-list) | Node serverless API + vanilla JS |
| 2 | URL Shortener | [`projects/02-url-shortener`](projects/02-url-shortener) | Node serverless API + redirects |
| 3 | Weather Dashboard | [`projects/03-weather-dashboard`](projects/03-weather-dashboard) | Node API proxy (Open-Meteo) |
| 4 | Markdown Notes | [`projects/04-markdown-notes`](projects/04-markdown-notes) | Node API (markdown → HTML) |
| 5 | Expense Tracker | [`projects/05-expense-tracker`](projects/05-expense-tracker) | Node API (aggregation) + chart |
| 6 | Quote Generator | [`projects/06-quote-generator`](projects/06-quote-generator) | Node API + favorites |
| 7 | Password Toolkit | [`projects/07-password-toolkit`](projects/07-password-toolkit) | Node API (generate/score) |
| 8 | QR Code Generator | [`projects/08-qr-code-generator`](projects/08-qr-code-generator) | Node API (`qrcode` package) |
| 9 | Kanban Board | [`projects/09-kanban-board`](projects/09-kanban-board) | Node API (CRUD) + drag & drop |
| 10 | Currency Converter | [`projects/10-currency-converter`](projects/10-currency-converter) | Node API proxy (exchange rates) |

## Running a project locally

Each folder is a standalone [Vercel](https://vercel.com) project (zero-config "Other"
runtime: static files at the root + serverless functions in `api/`).

```bash
cd projects/01-todo-list
npm install   # only needed for projects that declare dependencies
vercel dev
```

## Deploying

```bash
cd projects/01-todo-list
vercel --prod
```

Each project deploys independently and gets its own URL.
