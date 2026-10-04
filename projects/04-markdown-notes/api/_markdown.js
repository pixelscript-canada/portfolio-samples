function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return out;
}

function renderMarkdown(markdown) {
  const lines = (markdown || '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let inCode = false;
  let listOpen = false;
  let quoteOpen = false;

  const closeList = () => { if (listOpen) { html.push('</ul>'); listOpen = false; } };
  const closeQuote = () => { if (quoteOpen) { html.push('</blockquote>'); quoteOpen = false; } };

  for (const raw of lines) {
    if (raw.trim().startsWith('```')) {
      if (!inCode) { closeList(); closeQuote(); html.push('<pre><code>'); inCode = true; }
      else { html.push('</code></pre>'); inCode = false; }
      continue;
    }
    if (inCode) { html.push(escapeHtml(raw)); continue; }

    const heading = raw.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList(); closeQuote();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^>\s?/.test(raw)) {
      closeList();
      if (!quoteOpen) { html.push('<blockquote>'); quoteOpen = true; }
      html.push(`<p>${inline(raw.replace(/^>\s?/, ''))}</p>`);
      continue;
    }
    closeQuote();

    if (/^\s*[-*]\s+/.test(raw)) {
      if (!listOpen) { html.push('<ul>'); listOpen = true; }
      html.push(`<li>${inline(raw.replace(/^\s*[-*]\s+/, ''))}</li>`);
      continue;
    }
    closeList();

    if (raw.trim() === '') continue;
    html.push(`<p>${inline(raw)}</p>`);
  }
  closeList(); closeQuote();
  if (inCode) html.push('</code></pre>');

  return html.join('\n');
}

module.exports = { renderMarkdown };
