function money(n) {
  return `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function relativeDate(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

async function loadSettingsIntoSidebar() {
  try {
    const res = await fetch('/api/settings');
    const s = await res.json();
    document.querySelectorAll('[data-workspace-name]').forEach((el) => { el.textContent = s.workspaceName; });
  } catch {}
}

document.addEventListener('DOMContentLoaded', loadSettingsIntoSidebar);
