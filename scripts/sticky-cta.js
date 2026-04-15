/**
 * Kazozo sticky pricing CTA
 * Self-contained injector: adds CSS + DOM + scroll handler.
 * Skip on pages that already have a #stickyCta (homepage has its own).
 * Pricing text is loaded from pricing.json via data-price if the loader is present,
 * otherwise falls back to the baked starter price.
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Ready guard
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (document.getElementById('stickyCta')) return; // homepage has its own
    if (document.body.hasAttribute('data-no-sticky-cta')) return;

    // Resolve root path (nested pages live under /agents/, /blog/, /compare/, /demo/)
    var slashes = (location.pathname.match(/\//g) || []).length;
    var root = slashes > 1 ? '../'.repeat(slashes - 1) : '';

    // Inject styles once
    if (!document.getElementById('kz-sticky-cta-css')) {
      var css = '\n' +
        '.kz-sticky-cta{position:fixed;right:20px;bottom:24px;z-index:997;transform:translateY(120%);opacity:0;transition:transform .35s ease, opacity .35s ease;pointer-events:none;}\n' +
        '.kz-sticky-cta.visible{transform:translateY(0);opacity:1;pointer-events:auto;}\n' +
        '.kz-sticky-cta a{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;background:#FF5733;color:#fff;border-radius:999px;font-weight:600;font-size:14px;letter-spacing:.01em;text-decoration:none;box-shadow:0 12px 32px rgba(255,87,51,.32),0 2px 6px rgba(0,0,0,.18);transition:transform .2s ease, box-shadow .2s ease;}\n' +
        '.kz-sticky-cta a:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(255,87,51,.42),0 2px 8px rgba(0,0,0,.22);}\n' +
        '.kz-sticky-cta .kz-sticky-arrow{transition:transform .2s ease;}\n' +
        '.kz-sticky-cta a:hover .kz-sticky-arrow{transform:translateX(3px);}\n' +
        '.kz-sticky-cta .kz-sticky-price{background:rgba(255,255,255,.18);padding:2px 10px;border-radius:999px;font-weight:700;font-size:13px;}\n' +
        '@media (max-width: 600px){.kz-sticky-cta{right:12px;left:12px;bottom:12px;}.kz-sticky-cta a{width:100%;justify-content:center;padding:14px 18px;font-size:14px;}}\n' +
        '@media print{.kz-sticky-cta{display:none !important;}}\n';
      var style = document.createElement('style');
      style.id = 'kz-sticky-cta-css';
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Build DOM
    var wrap = document.createElement('div');
    wrap.className = 'kz-sticky-cta';
    wrap.id = 'kzStickyCta';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', 'Pricing call to action');

    var a = document.createElement('a');
    a.href = root + 'pricing.html';
    a.innerHTML =
      '<span>Plans from</span>' +
      '<span class="kz-sticky-price" data-price="plans.starter.display">$249</span>' +
      '<span>/mo</span>' +
      '<svg class="kz-sticky-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    wrap.appendChild(a);
    document.body.appendChild(wrap);

    // Reveal after user scrolls a bit (or if page is short, reveal after 800ms)
    var shown = false;
    function check() {
      if (shown) return;
      if (window.scrollY > 500 || (document.documentElement.scrollHeight - window.innerHeight) < 600) {
        wrap.classList.add('visible');
        shown = true;
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    setTimeout(check, 800);
  });
})();
