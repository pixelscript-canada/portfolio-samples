# Luma — E-Commerce Store

A full storefront: product catalog with search/filtering, product detail
pages, a cart, and a real checkout flow — four pages, no framework, no
build step.

- `GET /api/products` — list products, supports `?category=` and `?q=` search
- `GET /api/products?id=...` — a single product
- `POST /api/orders` — places an order; body `{ items: [{id, qty}], customer }`
- `GET /api/orders?id=...` — look up a placed order

**The important part:** the client only ever sends product ids and
quantities. Every price, the subtotal, shipping, and tax are recomputed
server-side in `api/orders.js` from the product catalog — the frontend never
gets to decide what anything costs. That's the difference between a demo
cart and a cart that's safe to put in front of real customers.

Cart state lives in `localStorage` (just ids and quantities); product images
are deterministic placeholder photos from picsum.photos, seeded per product
so they stay consistent across reloads.
