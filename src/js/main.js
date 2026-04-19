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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTempleNav);
} else {
  initTempleNav();
}
