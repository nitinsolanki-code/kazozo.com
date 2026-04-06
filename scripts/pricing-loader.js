// Pricing Loader - Single Source of Truth
// Fetches pricing from /scripts/pricing.json and injects values into [data-price] elements
//
// SWAPPABLE: Replace fetch('/scripts/pricing.json') with fetch('/api/public/pricing')
// when the platform API is ready. No other changes needed.

document.addEventListener('DOMContentLoaded', function() {
  fetch('/scripts/pricing.json')
    .then(response => response.json())
    .then(pricing => {
      // Find all elements with data-price attribute
      document.querySelectorAll('[data-price]').forEach(element => {
        const path = element.getAttribute('data-price');
        const value = getNestedValue(pricing, path);
        if (value !== undefined) {
          element.textContent = value;
        }
      });
    })
    .catch(error => {
      console.warn('Pricing loader failed:', error);
      // Silently fail - fallback content in HTML will be used
    });
});

// Helper: resolve dot-notation paths like "plans.growth.display"
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
