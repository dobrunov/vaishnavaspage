import uk from '../locales/uk.json';
import en from '../locales/en.json';

const STORAGE_KEY = 'iskcon-lang';

/** @type {Record<string, Record<string, unknown>>} */
const bundles = { uk, en };

let locale = 'uk';

function normalizeLocale(raw) {
  if (raw === 'en') return 'en';
  return 'uk';
}

function readStoredLocale() {
  try {
    return normalizeLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'uk';
  }
}

/**
 * @param {string} key dot.path
 * @param {string} [forcedLocale]
 */
export function t(key, forcedLocale) {
  const loc = forcedLocale ?? locale;
  const pack = bundles[loc] ?? bundles.uk;
  const parts = key.split('.');
  let node = /** @type {unknown} */ (pack);
  for (const p of parts) {
    if (node === null || typeof node !== 'object' || !(p in node)) {
      node = undefined;
      break;
    }
    node = /** @type {Record<string, unknown>} */ (node)[p];
  }
  if (typeof node === 'string') return node;
  const fb = bundles.uk;
  let n2 = /** @type {unknown} */ (fb);
  for (const p of parts) {
    if (n2 === null || typeof n2 !== 'object' || !(p in n2)) {
      return key;
    }
    n2 = /** @type {Record<string, unknown>} */ (n2)[p];
  }
  return typeof n2 === 'string' ? n2 : key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const text = t(key);
    if (el.tagName === 'META') {
      el.setAttribute('content', text);
    } else if (el.tagName === 'TITLE') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    el.innerHTML = t(key);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key) return;
    el.setAttribute('aria-label', t(key));
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (!key) return;
    el.setAttribute('alt', t(key));
  });

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    const lang = btn.getAttribute('data-set-lang');
    const active = lang === locale;
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (active) {
      btn.setAttribute('aria-current', 'true');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  document.documentElement.lang = locale;
}

function bindLanguageSwitch() {
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-set-lang');
      if (lang === 'uk' || lang === 'en') setLocale(lang);
    });
  });
}

export function getLocale() {
  return locale;
}

export function setLocale(lang) {
  locale = normalizeLocale(lang);
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore quota / private mode
  }
  applyTranslations();
  document.dispatchEvent(
    new CustomEvent('iskcon-localechange', { detail: { locale } })
  );
}

export function initI18n() {
  locale = readStoredLocale();
  applyTranslations();
  bindLanguageSwitch();
  document.documentElement.classList.remove('i18n-pending');
}
