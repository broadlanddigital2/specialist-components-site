// Site search: live results from /search-index.json.
// Opens from the header search button, "/" key, or the search box in the mobile menu.
// Full results page: /search?q=...
(function () {
  const INDEX_URL = '/search-index.json';
  let index = null, loading = null;
  const load = () => loading || (loading = fetch(INDEX_URL).then(r => r.json()).then(d => (index = d.map(prep))));

  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9£.\s-]/g, ' ');
  function prep(item) {
    item._name = norm(item.name);
    item._hay = norm([item.name, item.sku, item.category].filter(Boolean).join(' '));
    item._sku = norm(item.sku || '').replace(/\s/g, '');
    return item;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function search(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length || !index) return [];
    const compact = terms.join('');
    const out = [];
    for (const it of index) {
      if (!terms.every(t => it._hay.includes(t))) continue;
      let score = 0;
      if (it._sku && it._sku === compact) score += 100;
      if (it._name.startsWith(terms[0])) score += 30;
      for (const t of terms) {
        if (new RegExp('(^|\\s)' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(it._name)) score += 10;
        else if (it._name.includes(t)) score += 4;
      }
      if (it.type === 'category') score += 8;
      if (it.stock === 'in') score += 2;
      out.push([score, it]);
    }
    return out.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name)).map(x => x[1]);
  }
  function mark(text, q) {
    let html = esc(text);
    norm(q).split(/\s+/).filter(t => t.length > 1).forEach(t => {
      html = html.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
    });
    return html;
  }

  const icon = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  };

  const productRow = (it, q, id) => `
    <li role="option" id="${id}" aria-selected="false"><a class="ss-prod" href="${it.url}">
      <span class="ss-prod__img">${it.image ? `<img src="${it.image}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>
      <span class="ss-prod__main"><span class="ss-prod__name">${mark(it.name, q)}</span>
        <span class="ss-prod__meta">${it.category ? esc(it.category) : ''}${it.sku ? `<span>SKU ${mark(it.sku, q)}</span>` : ''}</span></span>
      <span class="ss-prod__side">${it.price != null ? `<span class="ss-prod__price">${money(it.price)}</span>` : ''}
        ${it.stock ? `<span class="ss-stock ss-stock--${it.stock}">${it.stock === 'in' ? 'In stock' : 'Out of stock'}</span>` : ''}</span>
    </a></li>`;

  const QUICK = [
    ['Complete Crate Engines', '/shop/complete-engines.html'], ['Classic Mini Performance Parts', '/shop/classic-mini-performance-parts.html'],
    ['TwinKam 16v Conversion', '/shop/twinkam-16v-conversion.html'], ['Engine Management', '/shop/engine-management.html'],
    ['MG Performance Parts', '/shop/mg-performance-parts.html'], ['Sale & Special Offers', '/shop/sales-and-special-offers.html'],
  ];
  const SUGGEST = ['throttle body', 'gearknob', 'twinkam', 'ECU', 'split rim', 'cylinder head'];

  // ---------- overlay ----------
  const root = document.createElement('div');
  root.className = 'ss';
  root.hidden = true;
  root.innerHTML = `
    <div class="ss-scrim" data-close></div>
    <div class="ss-panel" role="dialog" aria-modal="true" aria-label="Search products">
      <div class="ss-bar">
        <div class="ss-field">${icon.search}
          <input class="ss-input" type="search" placeholder="Search parts, SKUs or categories" autocomplete="off" spellcheck="false"
            role="combobox" aria-expanded="false" aria-controls="ss-list" aria-autocomplete="list">
          <kbd class="ss-kbd">Esc</kbd>
        </div>
        <button type="button" class="ss-close" data-close aria-label="Close search">${icon.close}</button>
      </div>
      <div class="ss-body" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(root);
  const input = root.querySelector('.ss-input');
  const body = root.querySelector('.ss-body');
  let results = [], active = -1, lastFocus = null;

  function renderEmpty() {
    body.innerHTML = `
      <div class="ss-empty">
        <p class="ss-label">Popular searches</p>
        <div class="ss-chips">${SUGGEST.map(s => `<button type="button" class="ss-chip" data-q="${esc(s)}">${icon.search}${esc(s)}</button>`).join('')}</div>
        <p class="ss-label">Shop by category</p>
        <div class="ss-cats">${QUICK.map(([n, u]) => `<a class="ss-cat" href="${u}">${esc(n)}${icon.arrow}</a>`).join('')}</div>
      </div>`;
    results = []; active = -1; input.setAttribute('aria-expanded', 'false');
  }

  function render(q) {
    if (!q.trim()) return renderEmpty();
    if (!index) { body.innerHTML = '<p class="ss-msg">Loading…</p>'; load().then(() => render(input.value)); return; }
    const all = search(q);
    const cats = all.filter(i => i.type !== 'product').slice(0, 4);
    const prods = all.filter(i => i.type === 'product');
    results = prods.slice(0, 6);
    active = -1;
    if (!all.length) {
      body.innerHTML = `<div class="ss-none"><p class="ss-none__title">No results for “${esc(q)}”</p>
        <p>Try a different spelling, a part number, or browse a category. You can also call us on <a href="tel:+441953789311">+44 (0)1953 789311</a>.</p>
        <div class="ss-cats">${QUICK.map(([n, u]) => `<a class="ss-cat" href="${u}">${esc(n)}${icon.arrow}</a>`).join('')}</div></div>`;
      input.setAttribute('aria-expanded', 'false');
      return;
    }
    body.innerHTML = `
      ${cats.length ? `<p class="ss-label">Categories</p><div class="ss-chips">${cats.map(c => `<a class="ss-chip ss-chip--cat" href="${c.url}">${mark(c.name, q)}</a>`).join('')}</div>` : ''}
      ${prods.length ? `<p class="ss-label">Products <span>${prods.length}</span></p>
        <ul class="ss-list" id="ss-list" role="listbox">${results.map((it, i) => productRow(it, q, 'ss-opt-' + i)).join('')}</ul>` : ''}
      ${prods.length > results.length ? `<a class="ss-all" href="/search?q=${encodeURIComponent(q)}">View all ${prods.length} results ${icon.arrow}</a>` : ''}`;
    input.setAttribute('aria-expanded', String(!!results.length));
  }

  function setActive(i) {
    const opts = [...body.querySelectorAll('[role=option]')];
    if (!opts.length) return;
    active = (i + opts.length) % opts.length;
    opts.forEach((o, n) => o.setAttribute('aria-selected', String(n === active)));
    input.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  }

  function open(q) {
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('ss-open');
    load();
    if (typeof q === 'string') input.value = q;
    render(input.value);
    requestAnimationFrame(() => { input.focus(); input.select(); });
  }
  function close() {
    root.hidden = true;
    document.documentElement.classList.remove('ss-open');
    input.removeAttribute('aria-activedescendant');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => render(input.value), 90); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = body.querySelectorAll('[role=option] a')[active];
      if (opt) location.href = opt.href;
      else if (input.value.trim()) location.href = '/search?q=' + encodeURIComponent(input.value.trim());
    }
  });
  root.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) close();
    const chip = e.target.closest('[data-q]');
    if (chip) { input.value = chip.dataset.q; render(input.value); input.focus(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !root.hidden) { e.preventDefault(); close(); }
    const typing = /input|textarea|select/i.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if (e.key === '/' && root.hidden && !typing) { e.preventDefault(); open(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.hidden ? open() : close(); }
  });

  // Triggers: header search button(s) and the mobile menu search box
  document.querySelectorAll('button[aria-label="Open search"]').forEach(b => b.addEventListener('click', () => open()));
  document.querySelectorAll('#mobile-navigation input[type=search]').forEach(inp => {
    inp.readOnly = true;
    const go = () => { document.getElementById('menu-toggle')?.click(); open(inp.value); };
    inp.addEventListener('focus', go);
    inp.addEventListener('click', go);
  });
  // Warm the index when the user shows intent
  document.querySelectorAll('button[aria-label="Open search"]').forEach(b => b.addEventListener('pointerenter', load, { once: true }));

  // ---------- full results page ----------
  const page = document.getElementById('search-page');
  if (page) {
    const q = new URLSearchParams(location.search).get('q') || '';
    const form = page.querySelector('form'), field = page.querySelector('input');
    field.value = q;
    form.addEventListener('submit', e => { e.preventDefault(); location.search = '?q=' + encodeURIComponent(field.value.trim()); });
    const out = page.querySelector('.sp-results');
    if (!q.trim()) { out.innerHTML = '<p class="sp-msg">Type a part name, SKU or category above.</p>'; return; }
    load().then(() => {
      const all = search(q), prods = all.filter(i => i.type === 'product'), cats = all.filter(i => i.type !== 'product');
      document.title = `Search: ${q} | Specialist Components`;
      page.querySelector('.sp-count').textContent = `${prods.length} product${prods.length === 1 ? '' : 's'} for “${q}”`;
      out.innerHTML = (cats.length ? `<div class="ss-chips sp-cats">${cats.map(c => `<a class="ss-chip ss-chip--cat" href="${c.url}">${esc(c.name)}</a>`).join('')}</div>` : '') +
        (prods.length ? `<ul role="list" class="sp-grid">${prods.map(it => `<li><a class="pcard" href="${it.url}">
          <div class="pcard__media">${it.image ? `<img alt="" loading="lazy" src="${it.image}" onerror="this.parentElement.classList.add('is-empty')">` : ''}</div>
          <div class="pcard__body"><h3 class="pcard__title">${mark(it.name, q)}</h3>
            <div class="pcard__foot"><p class="pcard__price">${it.price != null ? money(it.price) : ''}</p><span class="pcard__go" aria-hidden="true">${icon.arrow}</span></div></div></a></li>`).join('')}</ul>`
          : `<div class="ss-none"><p class="ss-none__title">No products found</p><p>Try a different spelling or a part number, or call us on <a href="tel:+441953789311">+44 (0)1953 789311</a>.</p></div>`);
    });
  }
})();
