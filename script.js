const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const siteHeader = document.querySelector('body > header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');

document.body.classList.add('motion-ready');

if (siteHeader && navToggle && primaryNav) {
  siteHeader.classList.add('nav-enhanced');

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = siteHeader.classList.contains('nav-open');
    siteHeader.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');

    if (restoreFocus && wasOpen) {
      navToggle.focus();
    }
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const copyEmailButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('.copy-status');

if (copyEmailButton && copyStatus) {
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.copyEmail;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = email;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.className = 'sr-only';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();

        if (!copied) {
          throw new Error('Copy command was unavailable.');
        }
      }

      copyStatus.textContent = 'Email copied.';
      copyEmailButton.textContent = 'Copied';
    } catch (error) {
      copyStatus.textContent = `Copy unavailable. Email: ${email}`;
    }
  });
}
