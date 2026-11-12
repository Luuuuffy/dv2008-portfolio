/* All narrative and images remain available without JavaScript. */
(() => {
  // Keep native anchor destinations clear of the header, including wrapped nav
  // labels, browser zoom and changes in text size. CSS provides a no-JS fallback.
  const header = document.querySelector('.site-header');
  const updateHeaderOffset = () => {
    document.documentElement.style.setProperty('--header-offset', `${Math.ceil(header.getBoundingClientRect().height) + 24}px`);
  };
  if (header) {
    updateHeaderOffset();
    if ('ResizeObserver' in window) new ResizeObserver(updateHeaderOffset).observe(header);
    else window.addEventListener('resize', updateHeaderOffset, { passive: true });
  }

  const gallery = document.querySelector('.claim-gallery');
  const controls = document.querySelector('.gallery-controls');
  if (gallery && controls) {
    controls.hidden = false;
    const buttons = [...controls.querySelectorAll('button')];
    const updateControls = () => {
      controls.hidden = gallery.scrollWidth <= gallery.clientWidth + 2;
      buttons[0].disabled = gallery.scrollLeft <= 2;
      buttons[1].disabled = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2;
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const distance = gallery.querySelector('figure').getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).gap);
      gallery.scrollBy({
        left: Number(button.dataset.scroll) * distance,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }));
    gallery.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls, { passive: true });
    gallery.closest('details')?.addEventListener('toggle', updateControls);
    updateControls();
  }

  // Highlight the current contribution without replacing native anchor navigation.
  if ('IntersectionObserver' in window) {
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const entranceObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motionPreference.matches) entry.target.classList.add('reveal-enter');
        entranceObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section-heading, .stats > div, .popup-heading, .iteration-lesson').forEach(element => {
      entranceObserver.observe(element);
      element.addEventListener('animationend', () => element.classList.remove('reveal-enter'), { once: true });
    });

    const links = [...document.querySelectorAll('.site-header nav a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = links.find(item => item.hash === `#${entry.target.id}`);
        if (link && entry.isIntersecting) {
          links.forEach(item => item.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'location');
        } else if (link) {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    links.forEach(link => {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    });
  }
})();
