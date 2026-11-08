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
    btn.querySelector('.icon-open').classList.toggle('hidden', open);
    btn.querySelector('.icon-close').classList.toggle('hidden', !open);
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
