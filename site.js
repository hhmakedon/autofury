(function () {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navbar .nav-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (!href || href === '#') {
      return;
    }
    if (href === here) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Improve perceived quality with subtle section reveal animation.
  const revealTargets = document.querySelectorAll('.py-5.text-center, .my-5, main, footer');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      observer.observe(target);
    });
  }

  const forms = document.querySelectorAll('form[data-formsubmit]');

  forms.forEach((form) => {
    const rev = form.getAttribute('data-action-rev');
    if (rev) {
      form.action = rev.split('').reverse().join('');
    }

    const ts = document.createElement('input');
    ts.type = 'hidden';
    ts.name = '_ts';
    ts.value = String(Date.now());
    form.appendChild(ts);

    const submitBtn = form.querySelector('[type="submit"]');
    const delayMs = 5000 + Math.floor(Math.random() * 3000);
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.disabled = false;
      }, delayMs);
    }

    const tel = form.querySelector('input[name="phone"]');
    if (tel) {
      tel.setAttribute('pattern', '^[+()\\d\\s-]{10,20}$');
    }

    ['pickup_zip', 'delivery_zip'].forEach((name) => {
      const zip = form.querySelector(`input[name="${name}"]`);
      if (zip) {
        zip.setAttribute('pattern', '^\\d{5}(-\\d{4})?$');
      }
    });

    form.addEventListener('submit', (event) => {
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value.trim() !== '') {
        event.preventDefault();
        return;
      }

      const started = Number.parseInt(ts.value, 10) || 0;
      if (Date.now() - started < 4500) {
        event.preventDefault();
        alert('Please wait a moment before submitting.');
      }
    });
  });
})();
