/* GA4 interaction tracking — IncoBev Asia.
 * Sends events for every button / link / CTA click and the contact form submit,
 * on top of GA4's built-in page_view + Enhanced Measurement (scroll, outbound,
 * file downloads). No-op if gtag isn't present. */
(function () {
  'use strict';

  function ga() {
    return typeof window.gtag === 'function' ? window.gtag : null;
  }

  function label(el) {
    var aria = el.getAttribute('aria-label');
    if (aria) return aria.trim().replace(/\s+/g, ' ').slice(0, 100);
    // Strip material-symbol icon ligature text (e.g. "arrow_forward") from the label.
    var clone = el.cloneNode(true);
    var icons = clone.querySelectorAll('.material-symbols-outlined');
    for (var i = 0; i < icons.length; i++) icons[i].parentNode.removeChild(icons[i]);
    var t = (clone.textContent || '').trim();
    return t.replace(/\s+/g, ' ').slice(0, 100);
  }

  function section(el) {
    var s = el.closest('section, header, footer, article, nav');
    if (!s) return '';
    return (s.id || s.getAttribute('aria-label') || (s.className || '').split(' ')[0] || '').slice(0, 60);
  }

  // ---- Click tracking (delegated, capture phase so nothing is missed) ----
  document.addEventListener(
    'click',
    function (e) {
      var g = ga();
      if (!g) return;
      var el = e.target.closest('a, button, [role="button"]');
      if (!el) return;

      var tag = el.tagName.toLowerCase();
      var params = {
        link_text: label(el) || '(no text)',
        element: tag === 'a' ? 'link' : 'button',
        location: section(el),
        page_path: location.pathname,
      };

      if (tag === 'a') {
        var href = el.getAttribute('href') || '';
        params.link_url = href.slice(0, 200);
        if (/^mailto:/i.test(href)) {
          g('event', 'contact_click', { method: 'email', link_text: params.link_text });
        } else if (/^tel:/i.test(href)) {
          g('event', 'contact_click', { method: 'phone', link_text: params.link_text });
        } else if (el.hostname && el.hostname !== location.hostname && /^https?:/i.test(el.protocol || '')) {
          params.outbound = true;
        }
      }

      g('event', 'ui_click', params);
    },
    true
  );

  // ---- Contact form submit (lead) ----
  function wireForm() {
    var form = document.getElementById('contact-form-el');
    if (!form) return;
    form.addEventListener('submit', function () {
      var g = ga();
      if (!g) return;
      var typeEl = form.querySelector('[name="inquiry_type"]');
      var hubEl = form.querySelector('[name="hub"]');
      g('event', 'generate_lead', {
        form_id: 'contact',
        inquiry_type: typeEl ? typeEl.value : '',
        hub: hubEl ? hubEl.value : '',
      });
    });
  }
  // ---- Cookie consent banner (GA4 Consent Mode) ----
  function wireConsent() {
    var banner = document.getElementById('cookie-consent');
    if (!banner) return;
    var stored = null;
    try { stored = localStorage.getItem('ib-consent'); } catch (e) {}
    if (!stored) banner.hidden = false; // show until a choice is made
    function choose(v) {
      try { localStorage.setItem('ib-consent', v); } catch (e) {}
      var g = ga();
      if (v === 'granted' && g) g('consent', 'update', { analytics_storage: 'granted' });
      banner.hidden = true;
    }
    var accept = document.getElementById('cookie-accept');
    var decline = document.getElementById('cookie-decline');
    if (accept) accept.addEventListener('click', function () { choose('granted'); });
    if (decline) decline.addEventListener('click', function () { choose('denied'); });
  }

  function init() { wireForm(); wireConsent(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
