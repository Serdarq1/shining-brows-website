'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/lib/constants';
import { getDictionary, LOCALES } from '@/lib/i18n';

const LANG_LABELS = { tr: 'TR', en: 'EN' };

export default function Nav({ locale = 'tr', onLocaleChange, onMenuChange, forceHidden = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dict = getDictionary(locale);
  const langRef = useRef(null);
  // Tracks the last opened dropdown so its content stays mounted through
  // the closing animation instead of vanishing the moment state flips.
  const lastDropdownRef = useRef(null);

  // Close any open dropdown when clicking outside or pressing escape.
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e) => {
      if (!e.target.closest('[data-nav-dropdown]')) setOpenDropdown(null);
    };
    const onKey = (e) => e.key === 'Escape' && setOpenDropdown(null);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (onMenuChange) onMenuChange(menuOpen);
  }, [menuOpen, onMenuChange]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setLangOpen(false);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  const onLight = false; // navbar stays in dark/glass mode always
  const glass = scrolled && !menuOpen;
  const logoSrc = onLight ? '/images/logo_black.png.png' : '/images/logo_white.png';
  const textBase = onLight ? 'text-charcoal' : 'text-ivory';

  return (
    <>
      <nav
        className={[
          'fixed top-16 left-0 right-0 z-50 transition-all duration-300',
          glass
            ? 'backdrop-blur-md bg-white/10 border-b border-white/10'
            : 'bg-transparent',
          textBase,
          menuOpen || forceHidden ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0',
        ].join(' ')}
        aria-hidden={menuOpen || forceHidden}
      >
        <div className="relative max-w-[1600px] mx-auto px-7 md:px-10 h-[84px] md:h-[76px] flex items-center justify-between">
          <Link href="/" aria-label="Shining Brows — anasayfa" className="flex items-center">
            <Image
              key={logoSrc}
              src={logoSrc}
              alt="Shining Brows"
              width={520}
              height={180}
              priority
              className="h-[58px] md:h-[48px] w-auto object-contain"
            />
          </Link>

          <ul
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 xl:gap-10 font-nav"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              if (!link.subLinks) {
                return (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-3xl xl:text-[11px] uppercase whitespace-nowrap hover:opacity-70 transition-opacity"
                    >
                      {dict.nav[link.key]}
                    </Link>
                  </li>
                );
              }

              const isOpen = openDropdown === link.key;
              return (
                <li
                  key={link.key}
                  data-nav-dropdown={link.key}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(isOpen ? null : link.key)
                    }
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className="text-3xl xl:text-[11px] uppercase whitespace-nowrap hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                  >
                    {dict.nav[link.key]}
                    <svg
                      width="9"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className={[
                        'opacity-70 transition-transform duration-200',
                        isOpen ? 'rotate-180' : 'rotate-0',
                      ].join(' ')}
                      aria-hidden
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-7 md:gap-10 font-nav">
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="flex items-center gap-2 text-[15px] md:text-[16px] uppercase hover:opacity-80 transition-opacity"
              >
                <span>{LANG_LABELS[locale]}</span>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  className={[
                    'transition-transform duration-200',
                    langOpen ? 'rotate-180' : 'rotate-0',
                  ].join(' ')}
                  aria-hidden
                >
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <ul
                role="listbox"
                className={[
                  'absolute right-0 mt-3 min-w-[120px] py-2 border transition-all duration-200 origin-top-right',
                  langOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none',
                  onLight
                    ? 'bg-ivory border-charcoal/15 text-charcoal'
                    : 'bg-charcoal/80 border-white/20 text-ivory backdrop-blur-md',
                ].join(' ')}
              >
                {LOCALES.map((code) => (
                  <li key={code} role="option" aria-selected={code === locale}>
                    <button
                      type="button"
                      onClick={() => {
                        onLocaleChange && onLocaleChange(code);
                        setLangOpen(false);
                      }}
                      className={[
                        'w-full text-left px-5 py-2 text-[14px] uppercase transition-colors',
                        code === locale ? 'opacity-100' : 'opacity-60 hover:opacity-100',
                      ].join(' ')}
                    >
                      {LANG_LABELS[code]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label={menuOpen ? dict.nav.close : dict.nav.menu}
              className="flex items-center group"
            >
              <span className="relative w-9 h-9 flex items-center justify-center">
                <span
                  aria-hidden
                  className={[
                    'block absolute h-[2px] w-7 transition-all duration-300',
                    onLight ? 'bg-charcoal' : 'bg-ivory',
                    menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[6px]',
                  ].join(' ')}
                />
                <span
                  aria-hidden
                  className={[
                    'block absolute h-[2px] w-7 transition-all duration-300',
                    onLight ? 'bg-charcoal' : 'bg-ivory',
                    menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[6px]',
                  ].join(' ')}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ── Full-width mega dropdown — renders below the nav row, spans
              the whole viewport width, and is toggled by the parent
              button's state in `openDropdown`. Content stays mounted with
              the *last* active link so the closing transition animates
              smoothly instead of snapping. ──────────────────────── */}
        {(() => {
          const activeNavLink = NAV_LINKS.find(
            (l) => l.key === openDropdown && l.subLinks
          );
          if (activeNavLink) lastDropdownRef.current = activeNavLink;
          const renderedLink = activeNavLink || lastDropdownRef.current;
          const isAnyOpen = !!activeNavLink;
          return (
            <div
              data-nav-dropdown={openDropdown || ''}
              className={[
                'hidden lg:block absolute top-full left-0 right-0 transition-all duration-300 ease-out',
                isAnyOpen
                  ? 'opacity-100 pointer-events-auto translate-y-0'
                  : 'opacity-0 pointer-events-none -translate-y-2',
              ].join(' ')}
              aria-hidden={!isAnyOpen}
            >
              {renderedLink && (
                <div
                  className="border-y border-white/40"
                  style={{ background: 'rgba(0,0,0,0.95)' }}
                >
                  <div className="max-w-[1600px] mx-auto px-7 md:px-10 py-10 md:py-12">
                    {/* Workshoplar — italic Freight, left-aligned */}
                    <Link
                      href={renderedLink.subLinks[0].href}
                      onClick={() => setOpenDropdown(null)}
                      tabIndex={isAnyOpen ? 0 : -1}
                      className="block text-left text-ivory font-display italic hover:opacity-70 transition-opacity"
                      style={{
                        fontSize: 'clamp(22px, 2.2vw, 36px)',
                        lineHeight: 1.05,
                        fontWeight: 500,
                      }}
                    >
                      {dict.nav[renderedLink.subLinks[0].key]}
                    </Link>

                    {/* Hairline divider */}
                    <div className="h-px bg-white/30 my-5 md:my-7" aria-hidden />

                    {/* Remaining items inline, separated by • */}
                    <div className="flex flex-wrap items-center gap-x-6 md:gap-x-10 gap-y-4">
                      {renderedLink.subLinks
                        .slice(1)
                        .map((sub, i, arr) => (
                          <span
                            key={sub.href}
                            className="flex items-center gap-6 md:gap-10"
                          >
                            <Link
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              tabIndex={isAnyOpen ? 0 : -1}
                              className="text-ivory text-[15px] md:text-[18px] uppercase font-nav hover:opacity-70 transition-opacity"
                            >
                              {dict.nav[sub.key]}
                            </Link>
                            {i < arr.length - 1 && (
                              <span aria-hidden className="text-ivory/55">
                                •
                              </span>
                            )}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </nav>

      <div
        id="primary-menu"
        className={[
          'fixed inset-0 z-40 transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        style={{ background: 'rgba(26,20,16,0.96)', backdropFilter: 'blur(16px)' }}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label={dict.nav.close}
          className="absolute top-10 right-7 md:right-10 z-10 w-10 h-10 flex items-center justify-center text-ivory hover:opacity-70 transition-opacity"
        >
          <span aria-hidden className="block absolute h-[2px] w-7 bg-ivory rotate-45" />
          <span aria-hidden className="block absolute h-[2px] w-7 bg-ivory -rotate-45" />
        </button>

        <div className="h-full max-w-[1600px] mx-auto px-7 md:px-10 pt-[140px] pb-16 flex flex-col">
          <ul className="flex flex-col gap-3 md:gap-4">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.key}
                style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms' }}
                className={[
                  'transition-all duration-500',
                  menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
                ].join(' ')}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-nav font-light text-ivory hover:opacity-70 transition-opacity"
                  style={{
                    fontSize: 'clamp(40px, 7vw, 84px)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {dict.nav[link.key]}
                </Link>

                {link.subLinks && (
                  <div className="mt-3 pl-1 max-w-[640px]">
                    {/* Workshoplar */}
                    <Link
                      href={link.subLinks[0].href}
                      onClick={() => setMenuOpen(false)}
                      className="font-nav text-ivory/90 hover:opacity-70 transition-opacity text-[16px] md:text-[18px] uppercase"
                    >
                      {dict.nav[link.subLinks[0].key]}
                    </Link>

                    {/* Divider line */}
                    <div className="h-px bg-white/20 my-3" aria-hidden />

                    {/* Remaining items inline with • */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {link.subLinks.slice(1).map((sub, j, arr) => (
                        <span key={sub.href} className="flex items-center gap-3">
                          <Link
                            href={sub.href}
                            onClick={() => setMenuOpen(false)}
                            className="font-nav text-ivory/80 hover:opacity-70 transition-opacity text-[13px] md:text-[15px] uppercase"
                          >
                            {dict.nav[sub.key]}
                          </Link>
                          {j < arr.length - 1 && (
                            <span aria-hidden className="text-ivory/55">•</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div
            className={[
              'mt-12 transition-all duration-500',
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
            ].join(' ')}
            style={{ transitionDelay: menuOpen ? `${120 + NAV_LINKS.length * 60}ms` : '0ms' }}
          >
            <div className="text-[12px] uppercase tracking-[0.22em] font-nav font-semibold text-ivory/70 mb-4">
              {dict.nav.followUs}
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/shiningbrowsturkey"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 flex items-center justify-center border border-ivory/30 rounded-full text-ivory hover:bg-ivory hover:text-charcoal transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
