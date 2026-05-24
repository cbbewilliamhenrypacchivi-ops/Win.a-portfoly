const navLinks = document.querySelectorAll('.navbar__link');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
    }
    navLinks.forEach((node) => node.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

const navToggle = document.querySelector('.navbar__toggle');
const navDropdown = document.getElementById('navbarDropdown');
if (navToggle && navDropdown) {
  navToggle.addEventListener('click', () => {
    const isOpen = navDropdown.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navDropdown.setAttribute('aria-hidden', !isOpen);
  });
}

const handleResize = () => {
  if (navDropdown && navToggle && window.innerWidth > 900) {
    navDropdown.classList.remove('is-open');
    navDropdown.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
  }
};

window.addEventListener('resize', handleResize);
handleResize();

const detailToggles = document.querySelectorAll('.job-card__toggle');
detailToggles.forEach((button) => {
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const card = button.closest('.job-card');
    const isOpen = card.classList.toggle('job-card--open');
    button.textContent = isOpen ? 'Cerrar' : 'Ver detalles';
    button.setAttribute('aria-expanded', isOpen);
  });
});

const moreButtons = document.querySelectorAll('.job-card__more');
moreButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const href = button.getAttribute('href');
    if (href && href !== '#') return;

    event.preventDefault();
    button.blur();
  });
});

const faqSearch = document.getElementById('faqSearch');
if (faqSearch) {
  const faqEmpty = document.getElementById('faqEmpty');
  const questions = Array.from(document.querySelectorAll('.questions-container .question'));

  const normalize = (value) =>
    (value || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const applyFilter = () => {
    const query = normalize(faqSearch.value);
    let visibleCount = 0;

    questions.forEach((question) => {
      const text = normalize(question.textContent);
      const matches = query.length === 0 || text.includes(query);
      question.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (faqEmpty) {
      faqEmpty.hidden = visibleCount !== 0;
    }
  };

  faqSearch.addEventListener('input', applyFilter);
  applyFilter();
}

const servicesGrid = document.querySelector('.services-grid');
const serviceCards = servicesGrid ? Array.from(servicesGrid.querySelectorAll('.service-card')) : [];
if (servicesGrid && serviceCards.length) {
  const isServicesLayout = serviceCards.some((card) => card.querySelector('.service-details'));

  if (isServicesLayout) {
    const serviceOpeners = new Map();

    serviceCards.forEach((card) => {
      const button = card.querySelector('button');
      const label = button ? button.querySelector('span:first-child') : null;
      const serviceId = (card.getAttribute('id') || card.dataset.service || '').trim();

      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }

      const closeAll = () => {
        serviceCards.forEach((otherCard) => {
          const otherButton = otherCard.querySelector('button');
          const otherLabel = otherButton ? otherButton.querySelector('span:first-child') : null;

          otherCard.classList.remove('is-open');
          otherCard.hidden = false;
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          if (otherLabel) otherLabel.textContent = 'Explorar';
        });

        servicesGrid.classList.remove('has-open');
      };

      const toggleCard = () => {
        const wasOpen = card.classList.contains('is-open');
        closeAll();

        const isOpen = !wasOpen;
        if (!isOpen) return;

        card.classList.add('is-open');
        servicesGrid.classList.add('has-open');
        if (button) button.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Cerrar';

        serviceCards.forEach((otherCard) => {
          if (otherCard !== card) otherCard.hidden = true;
        });

        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      };

      if (serviceId) {
        serviceOpeners.set(serviceId, toggleCard);
      }

      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        if (event.target.closest('button')) return;
        toggleCard();
      });

      if (button) {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          toggleCard();
        });
      }
    });

    const openFromHash = () => {
      const hash = (window.location.hash || '').replace('#', '').trim();
      if (!hash) return;
      const opener = serviceOpeners.get(hash);
      if (opener) opener();
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }
}

const galleryButtons = Array.from(document.querySelectorAll('.portfolio-gallery__btn'));
if (galleryButtons.length) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeTargets = lightbox ? Array.from(lightbox.querySelectorAll('[data-lightbox-close]')) : [];
  const prevButton = lightbox ? lightbox.querySelector('[data-lightbox-prev]') : null;
  const nextButton = lightbox ? lightbox.querySelector('[data-lightbox-next]') : null;

  const images = galleryButtons
    .map((btn) => btn.querySelector('img'))
    .filter(Boolean)
    .map((img) => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || ''
    }))
    .filter((item) => item.src.length > 0);

  let activeIndex = 0;
  let lastFocusedElement = null;

  const isOpen = () => lightbox && lightbox.classList.contains('is-open');

  const clampIndex = (value) => {
    if (!images.length) return 0;
    const max = images.length - 1;
    if (value < 0) return max;
    if (value > max) return 0;
    return value;
  };

  const render = () => {
    if (!lightbox || !lightboxImage || !lightboxCounter) return;
    const item = images[activeIndex];
    if (!item) return;

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCounter.textContent = `Imagen ${activeIndex + 1} de ${images.length}`;
  };

  const open = (index) => {
    if (!lightbox || !images.length) return;
    activeIndex = clampIndex(index);
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    render();

    const focusTarget = lightbox.querySelector('[data-lightbox-next]') || lightbox.querySelector('[data-lightbox-close]');
    if (focusTarget instanceof HTMLElement) {
      focusTarget.focus();
    }
  };

  const close = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const goPrev = () => {
    activeIndex = clampIndex(activeIndex - 1);
    render();
  };

  const goNext = () => {
    activeIndex = clampIndex(activeIndex + 1);
    render();
  };

  galleryButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => open(index));
  });

  closeTargets.forEach((target) => target.addEventListener('click', close));
  if (prevButton) prevButton.addEventListener('click', goPrev);
  if (nextButton) nextButton.addEventListener('click', goNext);

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  });
}
