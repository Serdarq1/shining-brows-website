'use client';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';

const APP_STORE_URL =
  'https://apps.apple.com/tr/app/shining-brows-expert-portal/id6758101995';

export default function PromoBar({ hidden = false, locale = 'tr' }) {
  const dict = getDictionary(locale).promo;

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${dict.downloadApp} — ${dict.appName}`}
      className={[
        'fixed top-0 left-0 right-0 z-[60] bg-amber text-charcoal',
        'flex items-center justify-center gap-4 md:gap-6',
        'px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold font-nav',
        'transition-all duration-300 hover:bg-amber-deep',
        hidden ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100',
      ].join(' ')}
    >
      <Image
        src="/images/logo_black.png"
        alt=""
        width={500}
        height={206}
        className="h-12 w-auto object-contain"
      />
      <span aria-hidden className="opacity-50">•</span>
      <span className="hidden sm:inline">{dict.appName}</span>
      <span aria-hidden className="opacity-50 hidden sm:inline">•</span>
      <span>{dict.downloadApp} ↗</span>
    </a>
  );
}
