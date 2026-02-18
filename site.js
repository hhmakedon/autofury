// site.js
(function () {
  // ===== NAV active state (works across pages) =====
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href && href === here) a.classList.add('active'); else a.classList.remove('active');
  });

  // ===== Form hardening (any form[data-formsubmit]) =====
  const FORMS = document.querySelectorAll('form[data-formsubmit]');

  FORMS.forEach(form => {
    // (a) Obfuscate action so scrapers don't see your endpoint in HTML
    const rev = form.getAttribute('data-action-rev');
    if (rev) form.action = rev.split('').reverse().join('');

    // (b) Insert timestamp for min time-on-page
    const ts = document.createElement('input');
    ts.type = 'hidden';
    ts.name = '_ts';
    ts.value = String(Date.now());
    form.appendChild(ts);

    // (c) Disable submit briefly to deter instant bot posts (5–8s)
    const submitBtn = form.querySelector('[type="submit"]');
    const DELAY_MS = 5000 + Math.floor(Math.random() * 3000);
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => (submitBtn.disabled = false), DELAY_MS);
    }

    // (d) Tighten client-side validation
    const tel = form.querySelector('input[name="phone"]');
    if (tel) tel.setAttribute('pattern', '^[+()\\d\\s-]{10,20}$');

    ['pickup_zip','delivery_zip'].forEach(name => {
      const z = form.querySelector(`input[name="${name}"]`);
      if (z) z.setAttribute('pattern', '^\\d{5}(-\\d{4})?$');
    });

    // (e) Block bots (honeypot + too-fast submissions)
    form.addEventListener('submit', e => {
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value.trim() !== '') {
        e.preventDefault(); // caught a bot
        return;
      }
      const started = parseInt(ts.value, 10) || 0;
      if (Date.now() - started < 4500) {
        e.preventDefault();
        alert('Please wait a moment before submitting.');
      }
    });
  });
})();
