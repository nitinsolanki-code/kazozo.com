/**
 * Kazozo — Shared Navigation Component
 * Single source of truth for the site-wide nav bar.
 * Usage: <div id="site-nav"></div><script src="/nav.js"></script>
 *
 * The component injects its own scoped CSS, the canonical nav HTML,
 * the mobile drawer, and all interactive behaviour (hamburger, dropdown).
 * It also loads Space Grotesk if the page hasn't already.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  0.  Load Space Grotesk if not present                              */
  /* ------------------------------------------------------------------ */
  if (!document.querySelector('link[href*="Space+Grotesk"]')) {
    var preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect);

    var preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  /* ------------------------------------------------------------------ */
  /*  1.  Determine context-aware links                                  */
  /* ------------------------------------------------------------------ */
  var path = window.location.pathname;
  var isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/index');
  var isInSubdir = path.split('/').filter(Boolean).length > 1; // e.g. /compare/foo.html

  // For pages in subdirectories, prefix paths
  var prefix = isInSubdir ? '../' : '';

  var pricingHref  = prefix + 'pricing.html';
  var agentsHref   = prefix + 'agents.html';
  var appsHref     = isHome ? '#agentic-apps' : prefix + 'index.html#agentic-apps';
  var industriesHref = prefix + 'industries.html';
  var simulationHref = prefix + 'simulation.html';
  var demoHref     = prefix + 'book-a-demo.html';
  var homeHref     = prefix + 'index.html';
  var aboutHref    = prefix + 'about.html';
  var contactHref  = prefix + 'contact.html';
  var faqHref      = prefix + 'faq.html';

  /* ------------------------------------------------------------------ */
  /*  2.  Scoped CSS                                                     */
  /* ------------------------------------------------------------------ */
  var CSS = '\
/* ===== KAZOZO NAV — SHARED COMPONENT ===== */\n\
.kz-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 12px 24px; font-family: "Space Grotesk", sans-serif; }\n\
\n\
.kz-nav-inner {\n\
  max-width: 1200px; margin: 0 auto;\n\
  display: flex; justify-content: space-between; align-items: center;\n\
  background: rgba(19,19,22,0.80); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);\n\
  border: none; border-radius: 16px; padding: 14px 28px;\n\
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);\n\
}\n\
\n\
.kz-logo { font-family: "Space Grotesk", sans-serif; font-size: 24px; font-weight: 700; color: #E4E1E6; letter-spacing: -0.02em; text-decoration: none; }\n\
.kz-logo span { color: #FF5733; }\n\
\n\
.kz-nav-links { display: flex; gap: 24px; list-style: none; align-items: center; margin: 0; padding: 0; }\n\
.kz-nav-links a, .kz-nav-links .kz-dropdown-trigger {\n\
  font-family: "Space Grotesk", sans-serif; color: rgba(228,225,230,0.6); text-decoration: none;\n\
  font-size: 14px; font-weight: 500; transition: color 0.3s; cursor: pointer; letter-spacing: -0.01em;\n\
}\n\
.kz-nav-links a:hover, .kz-nav-links .kz-dropdown-trigger:hover { color: #E4E1E6; }\n\
\n\
/* Dropdown */\n\
.kz-dropdown { position: relative; }\n\
.kz-dropdown-trigger {\n\
  display: inline-flex; align-items: center; gap: 4px;\n\
  background: none; border: none; font: inherit; padding: 0;\n\
}\n\
.kz-dropdown-trigger svg { width: 12px; height: 12px; transition: transform 0.2s; }\n\
\n\
.kz-dropdown-menu {\n\
  position: absolute; top: calc(100% + 12px); left: -16px;\n\
  background: #1f1f22; border: none;\n\
  border-radius: 12px; padding: 8px; min-width: 240px;\n\
  opacity: 0; pointer-events: none; transform: translateY(-4px);\n\
  transition: all 0.2s ease; z-index: 1001;\n\
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);\n\
}\n\
.kz-dropdown-menu::before {\n\
  content: ""; position: absolute; top: -16px; left: 0; right: 0; height: 16px;\n\
}\n\
.kz-dropdown.kz-dropdown-open .kz-dropdown-menu { opacity: 1; pointer-events: auto; transform: translateY(0); }\n\
.kz-dropdown.kz-dropdown-open .kz-dropdown-trigger svg { transform: rotate(180deg); }\n\
.kz-dropdown-menu a {\n\
  display: flex; align-items: center; gap: 12px;\n\
  padding: 12px 14px; border-radius: 8px; transition: background 0.15s; color: rgba(228,225,230,0.6) !important;\n\
}\n\
.kz-dropdown-menu a:hover { background: rgba(255,255,255,0.04); }\n\
.kz-dropdown-icon {\n\
  width: 36px; height: 36px; border-radius: 10px;\n\
  display: flex; align-items: center; justify-content: center;\n\
  font-size: 18px; flex-shrink: 0;\n\
  background: rgba(70,234,237,0.08); border: 1px solid rgba(70,234,237,0.12);\n\
}\n\
.kz-dropdown-label { font-size: 13px; font-weight: 600; color: #E4E1E6; }\n\
.kz-dropdown-desc { font-size: 11px; color: #9e9ba5; margin-top: 1px; }\n\
.kz-dropdown-soon {\n\
  display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase;\n\
  letter-spacing: 1px; color: #EBC314; background: rgba(235,195,20,0.08);\n\
  padding: 2px 6px; border-radius: 4px; margin-left: 6px;\n\
}\n\
\n\
/* Talk to Kaz nav button */\n\
.kz-btn-nav {\n\
  background: linear-gradient(135deg, #FFB4A4, #FF5733); color: #580c00 !important; padding: 10px 22px;\n\
  border-radius: 10px; font-weight: 700; transition: all 0.3s; font-family: "Space Grotesk", sans-serif;\n\
  border: none; cursor: pointer; font-size: 14px;\n\
}\n\
.kz-btn-nav:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,87,51,0.25); filter: brightness(1.1); }\n\
\n\
/* Auth buttons */\n\
.kz-auth { display: flex; align-items: center; gap: 16px; margin-left: 24px; }\n\
.kz-login {\n\
  font-family: "Space Grotesk", sans-serif; color: rgba(228,225,230,0.6); text-decoration: none;\n\
  font-size: 14px; font-weight: 500; transition: color 0.3s;\n\
}\n\
.kz-login:hover { color: #E4E1E6; }\n\
.kz-signup {\n\
  font-family: "Space Grotesk", sans-serif; color: #580c00; text-decoration: none;\n\
  font-size: 14px; font-weight: 700;\n\
  background: linear-gradient(135deg, #FFB4A4, #FF5733);\n\
  padding: 8px 20px; border-radius: 10px; border: none; transition: all 0.3s;\n\
}\n\
.kz-signup:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,87,51,0.25); }\n\
\n\
/* Hamburger */\n\
.kz-hamburger {\n\
  display: flex; align-items: center; gap: 8px;\n\
  background: none; border: none; cursor: pointer; padding: 8px; z-index: 1001;\n\
}\n\
.kz-hamburger-lines {\n\
  display: flex; flex-direction: column; justify-content: center; width: 20px; height: 14px;\n\
}\n\
.kz-hamburger-lines span {\n\
  display: block; width: 100%; height: 1.5px;\n\
  background: #E4E1E6; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n\
}\n\
.kz-hamburger-lines span:first-child { margin-bottom: 5px; }\n\
.kz-hamburger-active .kz-hamburger-lines span:first-child { transform: rotate(45deg) translate(2.3px, 2.3px); }\n\
.kz-hamburger-active .kz-hamburger-lines span:last-child { transform: rotate(-45deg) translate(2.3px, -2.3px); }\n\
.kz-hamburger-label {\n\
  font-family: "Space Grotesk", sans-serif; font-size: 10px; font-weight: 500;\n\
  letter-spacing: 1.5px; text-transform: uppercase; color: #9e9ba5;\n\
}\n\
\n\
/* Mobile overlay + drawer */\n\
.kz-mobile-overlay {\n\
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;\n\
  background: rgba(12,11,18,0.6); backdrop-filter: blur(4px);\n\
  z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;\n\
}\n\
.kz-mobile-overlay.active { opacity: 1; pointer-events: auto; }\n\
\n\
.kz-mobile-nav {\n\
  position: fixed; top: 0; right: 0; bottom: 0;\n\
  width: 300px; max-width: 85vw;\n\
  background: #1b1b1e; border-left: 1px solid rgba(228,225,230,0.06);\n\
  z-index: 1002; transform: translateX(100%);\n\
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n\
  display: flex; flex-direction: column; padding: 80px 32px 40px;\n\
}\n\
.kz-mobile-nav.active { transform: translateX(0); }\n\
.kz-mobile-label {\n\
  font-size: 10px; font-weight: 600; letter-spacing: 2px;\n\
  text-transform: uppercase; color: #9e9ba5; margin-bottom: 24px;\n\
  font-family: "Space Grotesk", sans-serif;\n\
}\n\
.kz-mobile-nav a, .kz-mobile-nav .kz-mobile-link {\n\
  display: block; color: #E4E1E6; text-decoration: none;\n\
  font-size: 18px; font-weight: 500; padding: 14px 0;\n\
  border-bottom: 1px solid rgba(228,225,230,0.06); transition: color 0.3s;\n\
  font-family: "Space Grotesk", sans-serif;\n\
}\n\
.kz-mobile-nav a:hover { color: #FFB4A4; }\n\
.kz-mobile-cta {\n\
  margin-top: 32px; display: inline-flex; align-items: center;\n\
  justify-content: center; gap: 8px; padding: 14px 28px;\n\
  background: linear-gradient(135deg, #FFB4A4, #FF5733); color: #580c00; border-radius: 10px;\n\
  font-weight: 700; font-size: 15px; border: none;\n\
  text-decoration: none; transition: all 0.3s; cursor: pointer;\n\
  font-family: "Space Grotesk", sans-serif;\n\
}\n\
.kz-mobile-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,87,51,0.25); filter: brightness(1.1); }\n\
\n\
/* Responsive */\n\
@media (max-width: 900px) {\n\
  .kz-nav-links { display: none; }\n\
  .kz-auth { display: none; }\n\
  .kz-nav { padding: 8px 12px; }\n\
  .kz-nav-inner { padding: 10px 16px; border-radius: 12px; }\n\
}\n\
@media (min-width: 901px) {\n\
  .kz-hamburger { display: flex; }\n\
}\n\
';

  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ------------------------------------------------------------------ */
  /*  3.  Build HTML                                                     */
  /* ------------------------------------------------------------------ */
  var talkToKaz = "if(window.KazozoWidget){window.KazozoWidget.open()}else{document.getElementById('cta')?document.getElementById('cta').scrollIntoView({behavior:'smooth'}):window.location.href='" + homeHref + "'}";

  var navHTML = '\
<nav class="kz-nav">\
  <div class="kz-nav-inner">\
    <div style="display:flex;align-items:center;gap:16px;">\
      <button class="kz-hamburger" id="kzHamburger" aria-label="Toggle menu" aria-expanded="false">\
        <div class="kz-hamburger-lines"><span></span><span></span></div>\
        <span class="kz-hamburger-label">Menu</span>\
      </button>\
      <a href="' + homeHref + '" class="kz-logo" style="text-decoration:none;">kazo<span>zo</span></a>\
    </div>\
    <ul class="kz-nav-links">\
      <li class="kz-dropdown">\
        <button type="button" class="kz-dropdown-trigger">Products <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4.5l3 3 3-3"/></svg></button>\
        <div class="kz-dropdown-menu">\
          <a href="' + agentsHref + '">\
            <div class="kz-dropdown-icon">&#129302;</div>\
            <div>\
              <div class="kz-dropdown-label">AI Agents</div>\
              <div class="kz-dropdown-desc">Sales, support &amp; ops on autopilot</div>\
            </div>\
          </a>\
          <a href="' + appsHref + '" style="opacity:0.5; pointer-events:none;">\
            <div class="kz-dropdown-icon">&#9889;</div>\
            <div>\
              <div class="kz-dropdown-label">Agentic Apps <span class="kz-dropdown-soon">Soon</span></div>\
              <div class="kz-dropdown-desc">AI-powered business applications</div>\
            </div>\
          </a>\
        </div>\
      </li>\
      <li><a href="' + pricingHref + '">Pricing</a></li>\
      <li><a href="' + industriesHref + '">Industries</a></li>\
      <li><a href="' + simulationHref + '">Simulation</a></li>\
      <li><a href="' + demoHref + '">Book a demo</a></li>\
      <li><button type="button" onclick="' + talkToKaz + '" class="kz-btn-nav">Talk to Kaz</button></li>\
    </ul>\
    <div class="kz-auth">\
      <a href="https://api.kazozo.com/login.html?role=customer" class="kz-login">Login</a>\
      <a href="https://api.kazozo.com/signup.html" class="kz-signup">Get Started</a>\
    </div>\
  </div>\
</nav>\
\
<div class="kz-mobile-overlay" id="kzMobileOverlay"></div>\
<div class="kz-mobile-nav" id="kzMobileNav">\
  <span class="kz-mobile-label">Products</span>\
  <a href="' + agentsHref + '" class="kz-mobile-link">AI Agents</a>\
  <a href="#" class="kz-mobile-link" style="opacity:0.4; pointer-events:none;">Agentic Apps <span class="kz-dropdown-soon">Soon</span></a>\
  <span class="kz-mobile-label" style="margin-top:16px;">Navigate</span>\
  <a href="' + pricingHref + '" class="kz-mobile-link">Pricing</a>\
  <a href="' + industriesHref + '" class="kz-mobile-link">Industries</a>\
  <a href="' + demoHref + '" class="kz-mobile-link">Book a demo</a>\
  <a href="' + simulationHref + '" class="kz-mobile-link">Simulation</a>\
  <span class="kz-mobile-label" style="margin-top:16px;">Company</span>\
  <a href="' + aboutHref + '" class="kz-mobile-link">About</a>\
  <a href="' + faqHref + '" class="kz-mobile-link">FAQ</a>\
  <a href="' + contactHref + '" class="kz-mobile-link">Contact</a>\
  <button type="button" onclick="' + talkToKaz + ';kzCloseMobile();" class="kz-mobile-cta">Talk to Kaz &#8594;</button>\
  <div style="display:flex; gap:12px; margin-top:12px;">\
    <a href="https://api.kazozo.com/login.html?role=customer" class="kz-mobile-link" style="flex:1; text-align:center;">Login</a>\
    <a href="https://api.kazozo.com/signup.html" class="kz-mobile-cta" style="flex:1; text-align:center; margin:0;">Get Started</a>\
  </div>\
</div>';

  /* ------------------------------------------------------------------ */
  /*  4.  Inject into #site-nav (or prepend to body)                     */
  /* ------------------------------------------------------------------ */
  var target = document.getElementById('site-nav');
  if (target) {
    target.innerHTML = navHTML;
  } else {
    // Fallback: prepend to body
    var wrapper = document.createElement('div');
    wrapper.id = 'site-nav';
    wrapper.innerHTML = navHTML;
    document.body.insertBefore(wrapper, document.body.firstChild);
  }

  /* ------------------------------------------------------------------ */
  /*  5.  Interactivity                                                  */
  /* ------------------------------------------------------------------ */
  var hamburger = document.getElementById('kzHamburger');
  var mobileNav = document.getElementById('kzMobileNav');
  var mobileOverlay = document.getElementById('kzMobileOverlay');

  function kzOpenMobile() {
    hamburger.classList.add('kz-hamburger-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.kzCloseMobile = function () {
    hamburger.classList.remove('kz-hamburger-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', function () {
    mobileNav.classList.contains('active') ? kzCloseMobile() : kzOpenMobile();
  });
  mobileOverlay.addEventListener('click', kzCloseMobile);
  document.querySelectorAll('.kz-mobile-link').forEach(function (link) {
    link.addEventListener('click', kzCloseMobile);
  });

  /* Dropdown: JS-controlled hover with close delay (prevents gap-crossing flicker) */
  document.querySelectorAll('.kz-dropdown').forEach(function (dd) {
    var closeTimer = null;
    dd.addEventListener('mouseenter', function () {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      dd.classList.add('kz-dropdown-open');
    });
    dd.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () { dd.classList.remove('kz-dropdown-open'); }, 250);
    });
    /* Also support click/tap for touch devices */
    dd.querySelector('.kz-dropdown-trigger').addEventListener('click', function (e) {
      e.preventDefault();
      dd.classList.toggle('kz-dropdown-open');
    });
  });
})();
