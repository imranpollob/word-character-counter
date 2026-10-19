// Adapted from personal-brand-theme/launcher.js; mounted and cleaned up by the app.
import fallbackTools from './tools.json';
import './launcher.css';

const TOOLS_URL = 'https://imranpollob.github.io/personal-brand-theme/tools.json';
const STAR_KEY = 'launcher-starred';
const esc = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z" stroke-linejoin="round"/></svg>';

export function mountLauncher(slot) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let tools = fallbackTools;
  let stars = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STAR_KEY) || '[]');
    if (Array.isArray(saved)) stars = saved.filter(repo => typeof repo === 'string');
  } catch { /* Keep stars in memory when storage is unavailable. */ }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'bl-toggle';
  toggle.title = 'Browse all tools';
  toggle.setAttribute('aria-label', 'Browse all tools');
  toggle.setAttribute('aria-haspopup', 'dialog');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor">' +
    [5, 12, 19].flatMap(y => [5, 12, 19].map(x => `<circle cx="${x}" cy="${y}" r="1.7"/>`)).join('') +
    '</g></svg>';
  slot.append(toggle);

  const backdrop = document.createElement('div');
  backdrop.className = 'bl-backdrop';
  backdrop.hidden = true;
  const panel = document.createElement('div');
  panel.className = 'bl-panel';
  panel.id = 'brand-tools-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'All tools');
  panel.hidden = true;
  panel.innerHTML = '<div class="bl-grid"></div>';
  toggle.setAttribute('aria-controls', panel.id);
  document.body.append(backdrop, panel);
  const grid = panel.querySelector('.bl-grid');

  const render = () => {
    const ordered = [...tools].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
    const groups = new Map();
    const starred = ordered.filter(t => stars.includes(t.repo));
    if (starred.length) groups.set('Starred', starred);
    for (const tool of ordered.filter(t => !stars.includes(t.repo))) {
      const category = tool.category || 'Tools';
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(tool);
    }
    grid.innerHTML = [...groups].map(([name, items]) =>
      `<h3 class="bl-category">${esc(name)}</h3>` + items.map(t => {
        const starred = stars.includes(t.repo);
        return `<div class="bl-tile" style="--hue: ${Number(t.hue) || 170}">` +
          `<span class="bl-glyph" aria-hidden="true">${esc(t.glyph ?? '')}</span>` +
          `<a class="bl-link" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${esc(t.title)}</a>` +
          `<button type="button" class="bl-star" data-repo="${esc(t.repo)}" aria-pressed="${starred}" ` +
          `aria-label="${starred ? 'Unstar' : 'Star'} ${esc(t.title)}">${STAR}</button></div>`;
      }).join('')
    ).join('');
  };
  render();

  const place = () => {
    const rect = toggle.getBoundingClientRect();
    panel.style.maxHeight = `${Math.max(0, Math.min(640, innerHeight - rect.bottom - 24))}px`;
    panel.style.top = `${rect.bottom + 4}px`;
    panel.style.left = `${Math.max(20, Math.min(rect.right - panel.offsetWidth, innerWidth - panel.offsetWidth - 20))}px`;
  };
  const close = (refocus = false) => {
    panel.hidden = backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (refocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    if (!panel.hidden) return close();
    panel.hidden = backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    place();
    panel.querySelector('a')?.focus();
  }, options);
  // Keep the host app's shortcuts from handling keys used on the menu button.
  toggle.addEventListener('keydown', event => {
    if (panel.hidden) event.stopPropagation();
  }, options);
  backdrop.addEventListener('click', () => close(true), options);
  window.addEventListener('resize', () => { if (!panel.hidden) place(); }, options);
  window.addEventListener('scroll', () => { if (!panel.hidden) place(); }, { ...options, capture: true });
  document.addEventListener('keydown', event => {
    if (panel.hidden) return;
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    }
    if (event.key === 'Tab') {
      const controls = [toggle, ...panel.querySelectorAll('a, button')];
      const current = controls.indexOf(document.activeElement);
      const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    }
  }, options);
  grid.addEventListener('click', event => {
    const button = event.target.closest('.bl-star');
    if (!button) return;
    const repo = button.dataset.repo;
    stars = stars.includes(repo) ? stars.filter(r => r !== repo) : [...stars, repo];
    try { localStorage.setItem(STAR_KEY, JSON.stringify(stars)); } catch { /* Session only. */ }
    render();
    [...grid.querySelectorAll('.bl-star')].find(button => button.dataset.repo === repo)?.focus();
  }, options);

  // Render the bundled list immediately; refresh from the central registry when available.
  fetch(TOOLS_URL, options)
    .then(response => {
      if (!response.ok) throw new Error('Unable to refresh tools');
      return response.json();
    })
    .then(latest => {
      if (controller.signal.aborted || !Array.isArray(latest) || !latest.length) return;
      const valid = latest.filter(tool => {
        try {
          return typeof tool.repo === 'string' && typeof tool.title === 'string' &&
            ['https:', 'http:'].includes(new URL(tool.url).protocol);
        } catch { return false; }
      });
      if (valid.length) {
        const focused = document.activeElement;
        // Avoid replacing keyboard controls while someone is using the open menu.
        if (!panel.contains(focused)) {
          tools = valid;
          render();
        }
      }
    })
    .catch(() => { /* The bundled tool list works offline. */ });

  return () => {
    controller.abort();
    toggle.remove();
    backdrop.remove();
    panel.remove();
  };
}
