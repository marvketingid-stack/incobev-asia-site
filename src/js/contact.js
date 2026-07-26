/* Contact form handler — NO fake success state.
 *
 * Phase-1 status: no backend/endpoint has been provided by the client yet
 * (see PRD Open Questions: "What's the real form destination?"). So this form
 * is wired to a real submission path but ships in a clearly-labeled
 * NOT-CONNECTED state. To activate:
 *   1. Set data-endpoint on the <form> to a real POST URL (Formspree/Fluent/
 *      custom REST handler), and
 *   2. Set data-configured="true".
 * Until then, submitting shows an honest notice + a mailto fallback — it never
 * pretends the message was delivered.
 */
(function () {
  'use strict';
  var form = document.getElementById('contact-form-el');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function showStatus(kind, html) {
    if (!status) return;
    status.className =
      'mt-4 rounded-lg p-4 text-sm ' +
      (kind === 'error'
        ? 'bg-error-container text-on-error-container'
        : kind === 'success'
        ? 'bg-secondary-container text-on-secondary-container'
        : 'bg-surface-container text-on-surface-variant');
    status.innerHTML = html;
    status.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var configured = form.getAttribute('data-configured') === 'true';
    var endpoint = form.getAttribute('data-endpoint');

    if (!configured || !endpoint) {
      // Honest placeholder state — do not fake a successful send.
      showStatus(
        'notice',
        '<strong>Form not yet connected.</strong> This preview build has no ' +
          'submission endpoint configured. Please email us directly at ' +
          '<a class="underline font-semibold" href="mailto:hello@incobev.asia">hello@incobev.asia</a> ' +
          '— or a developer can activate this form by setting a real endpoint (see contact.js).'
      );
      return;
    }

    // Real submission path (used once an endpoint is configured).
    var original = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="material-symbols-outlined animate-spin">progress_activity</span> Sending…';

    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        showStatus('success', '<strong>Thank you.</strong> Your message has been sent — our regional team will be in touch.');
        form.reset();
      })
      .catch(function () {
        showStatus(
          'error',
          '<strong>Something went wrong.</strong> Please try again, or email ' +
            '<a class="underline font-semibold" href="mailto:hello@incobev.asia">hello@incobev.asia</a>.'
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
      });
  });
})();
