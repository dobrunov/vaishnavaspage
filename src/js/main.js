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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTempleNav();
    initCardCarousel();
  });
} else {
  initTempleNav();
  initCardCarousel();
}
