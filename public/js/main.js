// Minimal vanilla replacements for the React behaviour on the live site.

// --- Mobile navigation toggle ---
(function () {
  const btn = document.getElementById('menu-toggle');
  const panel = document.getElementById('mobile-navigation');
  if (!btn || !panel) return;
  const OPEN = ['translate-y-0', 'opacity-100'];
  const CLOSED = ['pointer-events-none', '-translate-y-2', 'opacity-0'];

  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    btn.querySelector('.icon-open')?.classList.toggle('hidden', open);
    btn.querySelector('.icon-close')?.classList.toggle('hidden', !open);
    panel.classList.remove(...(open ? CLOSED : OPEN));
    panel.classList.add(...(open ? OPEN : CLOSED));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
})();

// --- Hero carousel dots ---
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-track]');
  const dots = [...carousel.querySelectorAll('[data-dots] button')];
  const slides = [...track.children];

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }));

  function markActive() {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, n) => {
      const on = n === i;
      d.setAttribute('aria-current', String(on));
      d.classList.toggle('opacity-100', on);
      d.classList.toggle('opacity-50', !on);
      d.classList.toggle('hover:opacity-80', !on);
    });
  }
  track.addEventListener('scroll', () => requestAnimationFrame(markActive), { passive: true });
});

// --- Product detail page (.pdp) ---
(function () {
  const pdp = document.querySelector('.pdp');
  if (!pdp) return;
  const money = n => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Gallery
  const main = document.getElementById('pdp-main-img');
  pdp.querySelectorAll('.pdp-thumb').forEach(t => t.addEventListener('click', () => {
    main.style.opacity = 0;
    setTimeout(() => { main.src = t.dataset.src; main.style.opacity = 1; }, 120);
    pdp.querySelectorAll('.pdp-thumb').forEach(o => { o.classList.toggle('is-active', o === t); o.setAttribute('aria-current', String(o === t)); });
  }));

  // Price: base + selected option surcharges, x quantity shown in sticky bar
  const base = parseFloat(pdp.dataset.basePrice || '0');
  const qty = document.getElementById('pdp-qty');
  const priceEl = document.getElementById('pdp-price'), penceEl = document.getElementById('pdp-pence');
  const exVat = document.getElementById('pdp-exvat'), sticky = document.getElementById('pdp-sticky-price');
  function update() {
    const extra = [...pdp.querySelectorAll('[data-option]')].reduce((s, el) => s + parseFloat(el.value || 0), 0);
    const unit = base + extra;
    const [pounds, pence] = unit.toFixed(2).split('.');
    priceEl.textContent = Number(pounds).toLocaleString('en-GB');
    penceEl.textContent = '.' + pence;
    exVat.textContent = money(unit / 1.2);
    const q = Math.max(1, parseInt(qty.value, 10) || 1);
    if (sticky) sticky.textContent = money(unit * q) + (q > 1 ? ` (${q})` : '');
  }
  pdp.querySelectorAll('[data-option]').forEach(el => el.addEventListener('change', update));

  // Quantity
  const clamp = v => Math.min(99, Math.max(1, v || 1));
  pdp.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => { qty.value = clamp((parseInt(qty.value, 10) || 1) + Number(b.dataset.qty)); update(); }));
  qty.addEventListener('change', () => { qty.value = clamp(parseInt(qty.value, 10)); update(); });
  update();

  // Tabs (arrow keys move between tabs)
  const tabs = [...pdp.querySelectorAll('[role=tab]')];
  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus(); e.preventDefault();
    });
  });

  // Mobile sticky buy bar: show once the main button scrolls out of view
  const bar = document.querySelector('.pdp-sticky'), cta = pdp.querySelector('.pdp-actions');
  if (bar && cta) {
    let ticking = false;
    const check = () => { bar.classList.toggle('is-visible', cta.getBoundingClientRect().bottom < 0); ticking = false; };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    check();
  }
})();

// --- Card images: show a logo panel instead of a broken image ---
document.querySelectorAll('.ncard__media img, .pcard__media img').forEach(img => {
  const mark = () => img.parentElement.classList.add('is-empty');
  if (img.complete && img.naturalWidth === 0) mark(); else img.addEventListener('error', mark);
});

// --- Mega menu (desktop) ---
(function () {
  const trigger = document.querySelector('.mm-trigger');
  const panel = document.getElementById('mega-menu');
  const scrim = document.querySelector('.mm-scrim');
  const header = document.querySelector('header');
  if (!trigger || !panel) return;
  let closeTimer, openedAt = 0;
  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';
  function open() {
    clearTimeout(closeTimer);
    if (isOpen()) return;
    document.documentElement.style.setProperty('--mm-top', header.getBoundingClientRect().bottom + 'px');
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false; if (scrim) scrim.hidden = false;
    openedAt = Date.now();
  }
  function close(focusTrigger) {
    clearTimeout(closeTimer);
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true; if (scrim) scrim.hidden = true;
    if (focusTrigger) trigger.focus();
  }
  const closeSoon = () => { closeTimer = setTimeout(() => close(false), 180); };

  // A click straight after hover-open shouldn't immediately close it again.
  trigger.addEventListener('click', () => { if (!isOpen()) open(); else if (Date.now() - openedAt > 400) close(false); });
  // Hover to open on mouse/trackpad devices only
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    [trigger, panel].forEach(el => {
      el.addEventListener('mouseenter', open);
      el.addEventListener('mouseleave', closeSoon);
    });
  }
  scrim && scrim.addEventListener('click', () => close(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) close(true); });
  trigger.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); open(); panel.querySelector('a')?.focus(); }
  });
  panel.addEventListener('focusout', e => { if (!panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) close(false); });
  window.addEventListener('resize', () => { if (window.innerWidth < 1024 && isOpen()) close(false); });
})();

// "All categories" links open the mega menu on desktop, or the mobile menu's category list
document.querySelectorAll('[data-open-menu]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const mm = document.querySelector('.mm-trigger');
  if (window.innerWidth >= 1024 && mm) { window.scrollTo({ top: 0, behavior: 'smooth' }); mm.click(); return; }
  const t = document.getElementById('menu-toggle');
  if (t && t.getAttribute('aria-expanded') !== 'true') t.click();
  const d = document.querySelector('.mm-mobile'); if (d) d.open = true;
}));

// Category cards: logo panel instead of a broken image
document.querySelectorAll('.sc-card img').forEach(img => {
  const mark = () => { img.closest('.sc-card').classList.add('is-empty'); img.remove(); };
  if (img.complete && img.naturalWidth === 0) mark(); else img.addEventListener('error', mark);
});
