(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('#site-nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navLinks.classList.toggle('is-open', open);
    });
    navLinks.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  }

  const profileToggle = document.querySelector('.profile-toggle');
  const authorLinks = document.querySelector('#author-links');
  if (profileToggle && authorLinks) {
    profileToggle.addEventListener('click', () => {
      const open = profileToggle.getAttribute('aria-expanded') !== 'true';
      profileToggle.setAttribute('aria-expanded', String(open));
      authorLinks.classList.toggle('is-open', open);
    });
  }
})();
