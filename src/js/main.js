function initTempleNav() {
  document.querySelectorAll('[data-temple-nav]').forEach((root) => {
    const trigger = root.querySelector('.temple-nav-trigger');
    const panel = root.querySelector('.temple-nav-panel');
    const inner = root.querySelector('.temple-nav-inner');
    if (!trigger || !panel || !inner) return;

    if (root.classList.contains('is-open')) {
      trigger.setAttribute('aria-expanded', 'true');
    }

    function openPanel() {
      panel.style.height = '0px';
      root.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      void panel.offsetHeight;
      requestAnimationFrame(() => {
        panel.style.height = `${inner.scrollHeight}px`;
      });

      const onOpenEnd = (e) => {
        if (e.propertyName !== 'height') return;
        if (root.classList.contains('is-open')) {
          panel.style.height = 'auto';
        }
      };
      panel.addEventListener('transitionend', onOpenEnd, { once: true });
    }

    function closePanel() {
      const h = inner.scrollHeight;
      panel.style.height = `${h}px`;
      void panel.offsetHeight;
      requestAnimationFrame(() => {
        panel.style.height = '0px';
      });

      const onCloseEnd = (e) => {
        if (e.propertyName !== 'height') return;
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.height = '';
      };
      panel.addEventListener('transitionend', onCloseEnd, { once: true });
    }

    trigger.addEventListener('click', () => {
      if (root.classList.contains('is-open')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      if (!root.classList.contains('is-open')) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const next = `${inner.scrollHeight}px`;
        panel.style.height = next;
        requestAnimationFrame(() => {
          if (root.classList.contains('is-open')) {
            panel.style.height = 'auto';
          }
        });
      }, 120);
    });
  });
}

function initMobileMenu() {
  const mobileMenus = document.querySelectorAll('aside details');

  if (!mobileMenus.length) return;

  mobileMenus.forEach((menu) => {
    const menuLinks = menu.querySelectorAll('nav a');

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menu.removeAttribute('open');
      });
    });
  });

  document.addEventListener('click', (event) => {
    mobileMenus.forEach((menu) => {
      if (!menu.hasAttribute('open')) return;
      if (menu.contains(event.target)) return;

      menu.removeAttribute('open');
    });
  });
}

const ASSET_BASE_URL = import.meta.env.BASE_URL;

const EVENT_CARDS = [
  {
    id: 'darshan',
    imageSrc: `${ASSET_BASE_URL}images/gallery-harinami.png`,
    imageAlt: 'Харінами у місті: кожної суботи об 11:00',
    width: 900,
    height: 1200,
    title: 'Харінами у місті',
    subtitle: 'кожної суботи об 11:00',
    href: 'harinamy-u-misti.html',
  },
  {
    imageSrc: `${ASSET_BASE_URL}images/gallery-kirtan-vaishnavi.png`,
    imageAlt: 'Кіртан-вайшнаві: у вівтарі з 13:00 до 14:00',
    width: 900,
    height: 1200,
    title: 'Кіртан-вайшнаві',
    subtitle: 'У вівтарі З 13:00 до 14:00',
    href: 'kirtan-vaishnavi.html',
  },
  {
    imageSrc: `${ASSET_BASE_URL}images/krishna-katha.png`,
    imageAlt: 'Крішна катха',
    width: 768,
    height: 1024,
    title: 'Крішна катха',
    href: 'krishna-katha.html',
  },
  {
    imageSrc: `${ASSET_BASE_URL}images/education-bhagavad-gita.png`,
    imageAlt: 'Бгагавад-гіта, окуляри та вервиця',
    width: 535,
    height: 302,
    title: 'Школа бхакті',
    subtitle: 'навчїться любити',
    href: 'shkola-bhakti.html',
  },
  {
    imageSrc: `${ASSET_BASE_URL}images/womens-nama-hatta.png`,
    imageAlt: 'Женская нама-хатта',
    width: 674,
    height: 1200,
    title: 'Женская нама-хатта',
    href: 'zhenskaya-nama-hatta.html',
  },
  {
    imageSrc: `${ASSET_BASE_URL}images/holiday-card.png`,
    imageAlt: 'Святкова афіша',
    width: 724,
    height: 1024,
    title: 'Вайшнавське свято',
    href: 'vaishnavske-svyato.html',
  },
];

function createEventCardMarkup(card, view) {
  const sourcePage = view === 'grid' ? 'events' : 'home';
  const href = `${card.href}?from=${sourcePage}`;
  const cardClass =
    view === 'carousel'
      ? 'group relative block aspect-[3/4] min-w-[15.5rem] snap-start overflow-hidden rounded-lg bg-gray-300 shadow-md transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-w-[17.5rem] lg:min-w-[18.5rem]'
      : 'group relative block aspect-[3/4] overflow-hidden rounded-lg bg-gray-300 shadow-md transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

  const idAttr = card.id ? ` id="${card.id}"` : '';
  const carouselAttr = view === 'carousel' ? ' data-carousel-card' : '';
  const extraClass = card.id && view === 'carousel' ? ' scroll-mt-4' : '';
  const subtitleMarkup = card.subtitle
    ? `
                  <p class="font-sans text-sm font-semibold text-white/90">
                    ${card.subtitle}
                  </p>`
    : '';

  return `
              <a${idAttr}${carouselAttr}
                href="${href}"
                aria-label="${card.title}"
                class="${cardClass}${extraClass}"
              >
                <img
                  src="${card.imageSrc}"
                  alt="${card.imageAlt}"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  width="${card.width}"
                  height="${card.height}"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                  <p class="font-sans text-lg font-bold">${card.title}</p>${subtitleMarkup}
                </div>
              </a>`;
}

function initEventCards() {
  document.querySelectorAll('[data-event-cards]').forEach((container) => {
    const view = container.getAttribute('data-event-cards') || 'grid';
    container.innerHTML = EVENT_CARDS.map((card) => createEventCardMarkup(card, view)).join('');
  });
}

function initCardCarousel() {
  document.querySelectorAll('[data-card-carousel-root]').forEach((root) => {
    const track = root.querySelector('[data-card-carousel]');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');

    if (!track || !prev || !next) return;

    function getStep() {
      const card = track.querySelector('[data-carousel-card]');
      if (!card) return track.clientWidth * 0.85;
      const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0');
      return card.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const current = Math.round(track.scrollLeft);
      prev.disabled = current <= 4;
      next.disabled = current >= maxScroll - 4;
      prev.classList.toggle('opacity-40', prev.disabled);
      next.classList.toggle('opacity-40', next.disabled);
      prev.classList.toggle('cursor-not-allowed', prev.disabled);
      next.classList.toggle('cursor-not-allowed', next.disabled);
    }

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
}

function initEventReturnLink() {
  const returnLink = document.querySelector('[data-event-return-link]');
  if (!returnLink) return;

  const from = new URLSearchParams(window.location.search).get('from');

  if (from === 'events') {
    returnLink.href = 'events.html';
    returnLink.textContent = 'ДО ПОДІЙ';
    return;
  }

  returnLink.href = 'index.html';
  returnLink.textContent = 'НА ГОЛОВНУ';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTempleNav();
    initMobileMenu();
    initEventCards();
    initCardCarousel();
    initEventReturnLink();
  });
} else {
  initTempleNav();
  initMobileMenu();
  initEventCards();
  initCardCarousel();
  initEventReturnLink();
}
