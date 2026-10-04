# Portfolio Samples

Ten small full-stack demo projects. Each one has its own frontend (plain HTML/CSS/JS)
and a real backend (Vercel serverless functions under `api/`), is independently
deployable, and lives in its own folder so the source is easy to browse. The
backends intentionally span five languages/runtimes to show the same pattern
(a tiny frontend talking to a real API) isn't tied to one stack.

| # | Project | Folder | Backend | Stack |
|---|---------|--------|---------|-------|
| 1 | Todo List API | [`projects/01-todo-list`](projects/01-todo-list) | Node.js | Vercel Node runtime + vanilla JS |
| 2 | URL Shortener | [`projects/02-url-shortener`](projects/02-url-shortener) | Node.js | Vercel Node runtime + redirects |
| 3 | Weather Dashboard | [`projects/03-weather-dashboard`](projects/03-weather-dashboard) | **Python** | Vercel Python runtime, proxies Open-Meteo |
| 4 | Markdown Notes | [`projects/04-markdown-notes`](projects/04-markdown-notes) | Node.js | Hand-written Markdown → HTML parser |
| 5 | Expense Tracker | [`projects/05-expense-tracker`](projects/05-expense-tracker) | **Go** | Vercel Go runtime, server-side aggregation |
| 6 | Quote Generator | [`projects/06-quote-generator`](projects/06-quote-generator) | **Python** | Vercel Python runtime + favorites |
| 7 | Password Toolkit | [`projects/07-password-toolkit`](projects/07-password-toolkit) | **Ruby** | Vercel Ruby runtime, `SecureRandom` |
| 8 | QR Code Generator | [`projects/08-qr-code-generator`](projects/08-qr-code-generator) | Node.js | `qrcode` npm package |
| 9 | Kanban Board | [`projects/09-kanban-board`](projects/09-kanban-board) | Node.js | Drag & drop + shared in-memory store |
| 10 | Currency Converter | [`projects/10-currency-converter`](projects/10-currency-converter) | **PHP** | Community `vercel-php` runtime |

## Running a project locally

Each folder is a standalone [Vercel](https://vercel.com) project (zero-config
static files at the root + serverless functions in `api/`, runtime picked
automatically per project by file extension/config: `.js` → Node, `.py` →
Python, `.go` → Go, `.rb` → Ruby, `.php` → PHP via `vercel-php`).

```bash
cd projects/01-todo-list
npm install   # only for Node projects that declare dependencies
vercel dev
```

## Deploying

```bash
cd projects/01-todo-list
vercel --prod
```

Each project deploys independently and gets its own URL.
