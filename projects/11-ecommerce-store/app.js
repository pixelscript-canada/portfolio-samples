// Shared cart + formatting helpers used across every page. Cart state lives
// in localStorage (it's a browser-only concern — only ids and quantities,
// never prices); real prices are only ever trusted from the server response
// at checkout time.

const CART_KEY = 'luma_cart_v1';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
}

function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter((i) => i.id !== id));
}

function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = cartCount();
  });
}

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

// Product imagery is self-contained (gradient + line icon per category)
// rather than hotlinked stock photos — zero external dependency, loads
// instantly, and never shows a broken-image icon to a client.
const CATEGORY_THEME = {
  Accessories: {
    from: '#ffd9c7', to: '#ff9d6c',
    icon: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  },
  Apparel: {
    from: '#dbe4ff', to: '#8098ff',
    icon: '<path d="M8 4l4 2 4-2 4 4-3 3v9H7v-9L4 8z"/>',
  },
  Home: {
    from: '#d9f4e4', to: '#58c78a',
    icon: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  },
  Tech: {
    from: '#e3e3f3', to: '#53536e',
    icon: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"/>',
  },
};

function productArt(category, size = '100%') {
  const theme = CATEGORY_THEME[category] || CATEGORY_THEME.Accessories;
  return `
    <div class="thumb-art" style="background: linear-gradient(135deg, ${theme.from}, ${theme.to})">
      <svg width="${size === '100%' ? 72 : size}" height="${size === '100%' ? 72 : size}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">
        ${theme.icon}
      </svg>
    </div>
  `;
}

function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
