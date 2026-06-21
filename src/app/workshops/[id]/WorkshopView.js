'use client';
import { useState } from 'react';
import Link from 'next/link';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import WorkshopRegisterSection from '@/components/WorkshopRegisterSection';
import Footer from '@/components/Footer';
import { RANK_LOGOS } from '@/lib/workshops';
import { getDictionary } from '@/lib/i18n';

export default function WorkshopView({ workshop }) {
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);

  // Soft 404 — keep the chrome so the user can navigate away easily.
  if (!workshop) {
    const dict = getDictionary(locale).workshop;
    return (
      <>
        <PromoBar hidden={menuOpen} locale={locale} />
        <Nav
          locale={locale}
          onLocaleChange={setLocale}
          onMenuChange={setMenuOpen}
        />
        <main className="bg-black text-ivory min-h-[60vh] flex items-center justify-center px-7">
          <div className="text-center max-w-[520px]">
            <h1
              className="font-display italic text-ivory"
              style={{
                fontSize: 'clamp(32px, 4vw, 56px)',
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {dict.notFoundTitle}
            </h1>
            <p className="mt-5 font-nav text-ivory/75 text-[14px] leading-[1.7]">
              {dict.notFoundBody}
            </p>
            <Link
              href="/workshops"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-ivory/30 px-7 py-3 font-nav font-semibold uppercase text-ivory hover:bg-ivory hover:text-charcoal transition-colors"
              style={{ fontSize: '11px', letterSpacing: '0.26em' }}
            >
              <span>{dict.backToCalendar}</span>
              <span aria-hidden>↗︎</span>
            </Link>
          </div>
        </main>
        <Footer locale={locale} />
      </>
    );
  }

  return (
    <>
      <PromoBar hidden={menuOpen} locale={locale} />
      <Nav
        locale={locale}
        onLocaleChange={setLocale}
        onMenuChange={setMenuOpen}
      />
      <main>
        <WorkshopRegisterSection
          workshop={workshop}
          locale={locale}
          rankLogos={RANK_LOGOS}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
