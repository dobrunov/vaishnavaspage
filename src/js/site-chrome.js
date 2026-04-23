const ASSET_BASE = import.meta.env.BASE_URL;

/** @typedef {{ href: string, key: string }} NavItem */

/** @type {NavItem[]} */
const PRIMARY_NAV = [
  { href: 'darshan.html', key: 'nav.darshan' },
  { href: 'schedule.html', key: 'nav.schedule' },
  { href: 'broadcast.html', key: 'nav.broadcast' },
  { href: 'education.html', key: 'nav.education' },
  { href: 'events.html', key: 'nav.events' },
  { href: 'donate.html', key: 'nav.donate' },
  { href: 'contacts.html', key: 'nav.contacts' },
];

function getPathname() {
  try {
    return window.location.pathname;
  } catch {
    return '';
  }
}

function getCurrentHtmlFile() {
  const p = getPathname();
  const segs = p.split('/').filter(Boolean);
  const last = segs[segs.length - 1];
  if (!last) return 'index.html';
  if (last.includes('.')) return last;
  return 'index.html';
}

function isHomePage() {
  if (document.documentElement.getAttribute('data-page') === 'home') {
    return true;
  }
  return getCurrentHtmlFile() === 'index.html';
}

/**
 * @param {string} className
 * @param {string} href
 * @param {string} i18nKey
 * @param {string} [extraClass]
 * @param {string} [ariaCurrent]
 */
function navLinkMarkup(className, href, i18nKey, extraClass, ariaCurrent) {
  const ac = ariaCurrent ? ` aria-current="${ariaCurrent}"` : '';
  return `<a
              href="${href}"
              class="${className}${extraClass ?? ''}"${ac}
              data-i18n="${i18nKey}"
            ></a>`;
}

function buildHeaderHtml() {
  const current = getCurrentHtmlFile();
  const homeHref = isHomePage() ? 'index.html#home' : 'index.html';

  const linkBase =
    'site-header__nav-link group relative inline-flex items-center rounded-md px-2.5 py-2 text-[15px] font-semibold text-stone-700 transition-colors duration-200 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-3';

  const mobileLinkBase =
    'site-header__nav-link group relative block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-stone-800 transition-colors duration-200 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

  const primaryDesktop = PRIMARY_NAV.map((item) => {
    const active = isCurrentPage(item.href, current);
    const ex = active ? ' text-brand' : '';
    return navLinkMarkup(linkBase, item.href, item.key, ex, active ? 'page' : undefined);
  }).join('\n            ');

  const primaryMobile = PRIMARY_NAV.map((item) => {
    const active = isCurrentPage(item.href, current);
    const ex = active ? ' text-brand' : '';
    return navLinkMarkup(
      mobileLinkBase,
      item.href,
      item.key,
      ex,
      active ? 'page' : undefined
    );
  }).join('\n                ');

  return `<header
  id="site-header"
  class="site-header min-h-[4.25rem] md:min-h-20 sticky top-0 z-50 bg-footer-cream/75 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-lg backdrop-saturate-150"
  data-site-header
  role="banner"
>
  <div class="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-3 px-4 text-[15px] sm:px-6 md:h-20 md:px-6 lg:px-8">
    <a
      href="${homeHref}"
      class="site-header__logo flex shrink-0 items-center gap-2.5"
      data-i18n-aria-label="header.logoAria"
    >
      <img
        src="${ASSET_BASE}images/iskcon-kharkiv-logo.png"
        alt=""
        data-i18n-alt="header.logoAlt"
        class="h-12 w-auto sm:h-14"
        width="120"
        height="150"
        decoding="async"
      />
    </a>

    <nav
      class="site-header__nav-desktop hidden flex-1 items-center justify-center gap-0.5 min-[850px]:flex lg:gap-1"
      data-i18n-aria-label="aside.mainNav"
    >
            ${primaryDesktop}
    </nav>

    <div class="ms-auto flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
      <div
        class="site-header__lang flex items-center gap-0.5 rounded-full bg-white/80 px-1 py-0.5"
        role="group"
        data-i18n-aria-label="lang.groupLabel"
      >
        <button
          type="button"
          class="site-header__lang-btn rounded-full px-2 py-1 text-[15px] font-medium text-stone-600 transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          data-set-lang="uk"
          data-i18n="lang.uk"
        >УК</button>
        <span class="text-stone-200" aria-hidden="true">|</span>
        <button
          type="button"
          class="site-header__lang-btn rounded-full px-2 py-1 text-[15px] font-medium text-stone-600 transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          data-set-lang="en"
          data-i18n="lang.en"
        >EN</button>
      </div>

      <details class="site-chrome-menu relative min-[850px]:hidden" data-site-mobile-menu>
        <summary
          class="list-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-stone-800 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden"
          aria-label="Menu"
          data-i18n-aria-label="aside.menu"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </summary>
        <div
          class="absolute right-0 top-full z-50 mt-1 w-screen max-w-[20rem] rounded-xl border border-stone-200/90 bg-white p-2.5 text-stone-800 shadow-2xl ring-1 ring-black/5"
        >
          <nav
            class="max-h-[min(70vh,28rem)] overflow-y-auto"
            data-i18n-aria-label="aside.mainNav"
          >
                ${primaryMobile}
          </nav>
        </div>
      </details>
    </div>
  </div>
</header>`;
}

/**
 * @param {string} targetFile
 * @param {string} currentFile
 */
function isCurrentPage(targetFile, currentFile) {
  return currentFile === targetFile;
}

function buildFooterHtml() {
  /* Palette: warm cream + logo orange (ISKCON Kharkiv logo ref) */
  return `<footer
  id="site-footer"
  class="site-footer text-[14px] font-sans text-footer-ink bg-footer-cream bg-[radial-gradient(1200px_900px_at_15%_15%,rgba(232,93,4,0.10),transparent_55%),radial-gradient(900px_700px_at_85%_25%,rgba(242,101,34,0.10),transparent_58%),radial-gradient(900px_700px_at_25%_85%,rgba(242,101,34,0.08),transparent_60%),radial-gradient(1100px_800px_at_85%_85%,rgba(232,93,4,0.08),transparent_62%)]"
  data-site-footer
  role="contentinfo"
>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div class="sm:col-span-2 lg:col-span-1">
        <a href="index.html" class="mb-3 inline-block">
          <img
            src="${ASSET_BASE}images/iskcon-kharkiv-logo.png"
            alt=""
            class="h-16 w-auto sm:h-[4.5rem]"
            data-i18n-alt="header.logoAlt"
            width="100"
            height="125"
            loading="lazy"
            decoding="async"
          />
        </a>
        <p
          class="leading-relaxed text-footer-muted"
          data-i18n="footer.mission"
        >
        </p>
        <p
          class="mt-3 leading-relaxed text-footer-muted"
          data-i18n-html="aside.footer"
        >
        </p>
      </div>
      <div>
        <h2
          class="mb-3 font-bold uppercase tracking-[0.2em] text-footer-ink"
          data-i18n="footer.headingPlan"
        >
        </h2>
        <ul class="space-y-2.5 text-footer-ink">
          <li>
            <a
              class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
              href="schedule.html"
              data-i18n="nav.schedule"
            ></a>
          </li>
          <li>
            <a
              class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
              href="darshan.html"
              data-i18n="nav.darshan"
            ></a>
          </li>
          <li>
            <a
              class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
              href="how-to-get.html"
              data-i18n="nav.howToGet"
            ></a>
          </li>
        </ul>
      </div>
      <div>
        <h2
          class="mb-3 font-bold uppercase tracking-[0.2em] text-footer-ink"
          data-i18n="footer.headingConnect"
        >
        </h2>
        <ul class="space-y-2.5 text-footer-ink">
          <li>
            <a
              class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
              href="contacts.html"
              data-i18n="nav.contacts"
            ></a>
          </li>
          <li>
            <a
              class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
              href="broadcast.html"
              data-i18n="nav.broadcast"
            ></a>
          </li>
          <li>
            <a
              class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
              href="events.html"
              data-i18n="nav.events"
            ></a>
          </li>
        </ul>
        <ul class="mt-5 flex flex-wrap gap-2.5" data-i18n-aria-label="footer.socialGroup">
          <li>
            <a
              href="https://t.me/iskcon_kh"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-footer-accent text-white shadow-sm ring-1 ring-footer-accent/40 transition hover:brightness-110"
              rel="noopener noreferrer"
              target="_blank"
              data-i18n-aria-label="footer.socialTelegram"
              ><i class="fab fa-telegram text-[1.05rem] leading-none" aria-hidden="true"></i
            ></a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/hare.krishna.kharkov/"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-footer-accent text-white shadow-sm ring-1 ring-footer-accent/40 transition hover:brightness-110"
              rel="noopener noreferrer"
              target="_blank"
              data-i18n-aria-label="footer.socialFacebook"
              ><i class="fab fa-facebook-f text-[1rem] leading-none" aria-hidden="true"></i
            ></a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/channel/UC6aTIMPbCOMH9yk6WRukj-A"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-footer-accent text-white shadow-sm ring-1 ring-footer-accent/40 transition hover:brightness-110"
              rel="noopener noreferrer"
              target="_blank"
              data-i18n-aria-label="footer.socialYoutube"
              ><i class="fab fa-youtube text-[1rem] leading-none" aria-hidden="true"></i
            ></a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/iskconkharkiv/"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-footer-accent text-white shadow-sm ring-1 ring-footer-accent/40 transition hover:brightness-110"
              rel="noopener noreferrer"
              target="_blank"
              data-i18n-aria-label="footer.socialInstagram"
              ><i class="fab fa-instagram text-[1.05rem] leading-none" aria-hidden="true"></i
            ></a>
          </li>
        </ul>
      </div>
      <div>
        <h2
          class="mb-3 font-bold uppercase tracking-[0.2em] text-footer-ink"
          data-i18n="footer.headingAddress"
        >
        </h2>
        <p class="leading-relaxed text-footer-ink" data-i18n-html="content.contacts.addressHtml">
        </p>
        <p class="mt-4 text-footer-muted">
          <a
            href="contacts.html"
            class="footer-link inline-flex text-footer-accent transition hover:text-footer-accentHover"
            data-i18n="footer.writeUs"
          >
          </a>
        </p>
      </div>
    </div>
    <div
      class="mt-8 flex flex-col items-start justify-between gap-3 border-t border-footer-accent/35 pt-6 sm:flex-row sm:items-center"
    >
      <p class="text-footer-muted" data-i18n="footer.legal"></p>
      <p class="text-footer-muted" data-i18n="footer.credit"></p>
    </div>
  </div>
</footer>`;
}

export function installSiteChrome() {
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) {
    h.outerHTML = buildHeaderHtml();
  }
  if (f) {
    f.outerHTML = buildFooterHtml();
  }
}
