/**
 * Kazozo Analytics Loader
 *
 * Configured once here, included on every page.
 * When MEASUREMENT_ID is empty, this script is a no-op (safe to ship).
 *
 * To turn on GA4:
 *   1. Create a GA4 property at analytics.google.com
 *   2. Copy the Measurement ID (starts with "G-") into MEASUREMENT_ID below
 *   3. Push to main — it will take effect on next deploy
 *
 * To switch to Plausible / Fathom / Umami, replace the gtag block
 * with their loader snippet. Keep this file as the single point of install.
 */
(function () {
  var MEASUREMENT_ID = ''; // ← paste your GA4 ID here (e.g. "G-XXXXXXXXXX")

  if (!MEASUREMENT_ID || typeof window === 'undefined') return;
  if (window.__kzAnalyticsLoaded) return;
  window.__kzAnalyticsLoaded = true;

  // Honor Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  // Load gtag.js
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    // Optional: uncomment to respect cookieless setups
    // client_storage: 'none',
  });

  // Track key conversion clicks automatically
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var label = null;
    if (href.indexOf('pricing.html') !== -1) label = 'pricing_click';
    else if (href.indexOf('book-a-demo') !== -1) label = 'demo_click';
    else if (href.indexOf('agents.html') !== -1) label = 'agents_click';
    if (label) gtag('event', label, { link_url: href, page: location.pathname });
  }, { passive: true });
})();
