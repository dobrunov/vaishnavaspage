import { initI18n, t } from './i18n.js';
import { installSiteChrome } from './site-chrome.js';
import { initDonationForm } from './donation-form.js';

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
  const mobileMenus = document.querySelectorAll('details[data-site-mobile-menu]');

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

function initRevealOnScroll() {
  const elements = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!elements.length) return;

  // In case JS runs after first paint, avoid a "flash" when already visible.
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    elements.forEach((el) => {
      el.classList.remove('reveal');
      el.classList.add('is-in');
    });
    return;
  }

  elements.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  elements.forEach((el) => io.observe(el));
}

function initPageEnterAnimation() {
  // Deprecated: replaced by initPageTransitions() for consistent behavior across
  // browsers and bfcache restores. Kept for backward compatibility if called elsewhere.
}

function initPageTransitions() {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.remove('page-enter-pending');
    return;
  }

  const ENTER_MS = 1040;
  // Fast start, smooth finish (ease-out): appears quickly then settles.
  const easing = 'cubic-bezier(0, 0, 0.2, 1)';

  function playEnter() {
    try {
      // Ensure we start from hidden if the page came from bfcache.
      document.documentElement.classList.add('page-enter-pending');
      document.body.getAnimations?.().forEach((a) => a.cancel());
      document.body.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: ENTER_MS,
        easing,
        fill: 'both',
      });
    } catch {
      // no-op
    } finally {
      // Let CSS show content even if WAAPI fails.
      // (We remove it immediately; the animation keeps opacity at 0→1 via fill.)
      document.documentElement.classList.remove('page-enter-pending');
    }
  }

  // Run on first load and on bfcache restores.
  playEnter();
  window.addEventListener('pageshow', (ev) => {
    if (ev.persisted) playEnter();
  });
}

function initScheduleReveal() {
  // Add reveal-on-scroll to schedule blocks/items.
  // We do it in JS so the page stays clean and we can add a subtle stagger.
  if (!/\/schedule\.html$/.test(window.location.pathname)) return;

  const sections = Array.from(document.querySelectorAll('main section'));
  if (!sections.length) return;

  sections.forEach((section, sectionIdx) => {
    // Only target the two schedule content blocks (rounded paper-like sections).
    if (!section.classList.contains('rounded-2xl')) return;

    section.setAttribute('data-reveal', '');
    section.style.transitionDelay = `${Math.min(sectionIdx, 3) * 60}ms`;

    const items = Array.from(section.querySelectorAll('li'));
    items.forEach((li, idx) => {
      li.setAttribute('data-reveal', '');
      // Gentle stagger; cap so long lists don't feel sluggish.
      li.style.transitionDelay = `${Math.min(idx, 10) * 45}ms`;
    });
  });
}

function initHomeInfoReveal() {
  // Make the home info block feel as smooth as the carousel:
  // reveal the inner elements with a subtle stagger instead of the whole section at once.
  if (!/(^|\/)index\.html$/.test(window.location.pathname) && window.location.pathname !== '/' && window.location.pathname !== '') {
    return;
  }

  const section = document.querySelector('section#education');
  if (!section) return;

  const heading = section.querySelector('h2');
  const box = section.querySelector('div.rounded-2xl');
  const paragraphs = box ? Array.from(box.querySelectorAll('p')) : [];

  if (heading) {
    heading.setAttribute('data-reveal', '');
    heading.style.transitionDelay = '0ms';
  }

  if (box) {
    box.setAttribute('data-reveal', '');
    box.style.transitionDelay = '80ms';
  }

  paragraphs.forEach((p, idx) => {
    p.setAttribute('data-reveal', '');
    p.style.transitionDelay = `${140 + Math.min(idx, 6) * 70}ms`;
  });
}

function getEventCardDefs() {
  return [
    {
      id: 'darshan',
      imageSrc: `${ASSET_BASE_URL}images/gallery-harinami.png`,
      width: 900,
      height: 1200,
      href: 'harinamy-u-misti.html',
      titleKey: 'events.cards.harinami.title',
      subtitleKey: 'events.cards.harinami.subtitle',
      imageAltKey: 'events.cards.harinami.imageAlt',
    },
    {
      imageSrc: `${ASSET_BASE_URL}images/gallery-kirtan-vaishnavi.png`,
      width: 900,
      height: 1200,
      href: 'kirtan-vaishnavi.html',
      titleKey: 'events.cards.kirtanVaishnavi.title',
      subtitleKey: 'events.cards.kirtanVaishnavi.subtitle',
      imageAltKey: 'events.cards.kirtanVaishnavi.imageAlt',
    },
    {
      imageSrc: `${ASSET_BASE_URL}images/krishna-katha.png`,
      width: 768,
      height: 1024,
      href: 'krishna-katha.html',
      titleKey: 'events.cards.krishnaKatha.title',
      imageAltKey: 'events.cards.krishnaKatha.imageAlt',
    },
    {
      imageSrc: `${ASSET_BASE_URL}images/education-bhagavad-gita.png`,
      width: 535,
      height: 302,
      href: 'shkola-bhakti.html',
      titleKey: 'events.cards.shkolaBhakti.title',
      subtitleKey: 'events.cards.shkolaBhakti.subtitle',
      imageAltKey: 'events.cards.shkolaBhakti.imageAlt',
    },
    {
      imageSrc: `${ASSET_BASE_URL}images/womens-nama-hatta.png`,
      width: 674,
      height: 1200,
      href: 'zhenskaya-nama-hatta.html',
      titleKey: 'events.cards.namaHatta.title',
      imageAltKey: 'events.cards.namaHatta.imageAlt',
    },
    {
      imageSrc: `${ASSET_BASE_URL}images/holiday-card.png`,
      width: 724,
      height: 1024,
      href: 'vaishnavske-svyato.html',
      titleKey: 'events.cards.vaishnavaHoliday.title',
      imageAltKey: 'events.cards.vaishnavaHoliday.imageAlt',
    },
  ];
}

function createEventCardMarkup(card, view) {
  const title = t(card.titleKey);
  const imageAlt = t(card.imageAltKey);
  const subtitle =
    card.subtitleKey !== undefined ? t(card.subtitleKey) : undefined;

  const sourcePage = view === 'grid' ? 'events' : 'home';
  const href = `${card.href}?from=${sourcePage}`;
  const cardClass =
    view === 'carousel'
      ? 'ui-event-card group relative block aspect-[3/4] min-w-[18.6rem] snap-start overflow-hidden rounded-lg bg-gray-300 shadow-md transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-w-[21rem] lg:min-w-[22.2rem]'
      : 'ui-event-card group relative block aspect-[3/4] overflow-hidden rounded-lg bg-gray-300 shadow-md transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

  const idAttr = card.id ? ` id="${card.id}"` : '';
  const carouselAttr = view === 'carousel' ? ' data-carousel-card' : '';
  const extraClass = card.id && view === 'carousel' ? ' scroll-mt-4' : '';
  const subtitleMarkup = subtitle
    ? `
                  <p class="font-sans text-base font-semibold text-white/90">
                    ${subtitle}
                  </p>`
    : '';

  const titleClass = view === 'carousel' ? 'font-sans text-xl font-bold' : 'font-sans text-lg font-bold';
  const overlayPad = view === 'carousel' ? 'p-5' : 'p-4';

  return `
              <a${idAttr}${carouselAttr}
                href="${href}"
                aria-label="${title}"
                class="${cardClass}${extraClass}"
              >
                <img
                  src="${card.imageSrc}"
                  alt="${imageAlt}"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  width="${card.width}"
                  height="${card.height}"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 ${overlayPad} text-white">
                  <p class="${titleClass}">${title}</p>${subtitleMarkup}
                </div>
              </a>`;
}

function initEventCards() {
  document.querySelectorAll('[data-event-cards]').forEach((container) => {
    const view = container.getAttribute('data-event-cards') || 'grid';
    const cards = getEventCardDefs();
    container.innerHTML = cards.map((card) => createEventCardMarkup(card, view)).join('');

    // Soft reveal for carousel cards (staggered, low-risk)
    if (view === 'carousel') {
      const cards = Array.from(container.querySelectorAll('[data-carousel-card]'));
      cards.forEach((cardEl, idx) => {
        cardEl.setAttribute('data-reveal', '');
        // keep the motion subtle; cap delay so it doesn't feel sluggish on long lists
        cardEl.style.transitionDelay = `${Math.min(idx, 7) * 70}ms`;
      });
    }
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
    returnLink.textContent = t('events.returnToList');
    return;
  }

  returnLink.href = 'index.html';
  returnLink.textContent = t('events.returnHome');
}

function initShell() {
  installSiteChrome();
  initI18n();
  initDonationForm();
  initTempleNav();
  initMobileMenu();
  initEventCards();
  initCardCarousel();
  initEventReturnLink();
  initScheduleReveal();
  initHomeInfoReveal();
  initRevealOnScroll();
  initPageTransitions();
}

document.addEventListener('iskcon-localechange', () => {
  initEventCards();
  initEventReturnLink();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShell);
} else {
  initShell();
}
