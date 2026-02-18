(function () {
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  document.querySelectorAll('.navbar .nav-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (!href || href === '#') {
      return;
    }
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const forms = document.querySelectorAll('form[data-formsubmit]');
  forms.forEach((form) => {
    const reversedAction = form.getAttribute('data-action-rev');
    if (reversedAction) {
      form.action = reversedAction.split('').reverse().join('');
    }

    const startedAt = document.createElement('input');
    startedAt.type = 'hidden';
    startedAt.name = '_ts';
    startedAt.value = String(Date.now());
    form.appendChild(startedAt);

    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      setTimeout(() => {
        submitButton.disabled = false;
      }, 3500);
    }

    form.addEventListener('submit', (event) => {
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value.trim() !== '') {
        event.preventDefault();
        return;
      }

      const startMs = Number.parseInt(startedAt.value, 10) || 0;
      if (Date.now() - startMs < 2500) {
        event.preventDefault();
        alert('Please wait a moment before submitting.');
      }
    });
  });
})();
