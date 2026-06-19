'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * JoinIndustrySection — quiet black gallery.
 *
 * Centered editorial header (italic Freight) + descriptive paragraph, then
 * a simple responsive grid of portrait tiles below. No pin, no scrub —
 * just the existing `.reveal` fade-up on enter and Lenis-smoothed scroll
 * inherited from `LenisProvider`.
 * ------------------------------------------------------------------------- */

const GALLERY_IMAGES = [
  '/images/1.png',
  '/images/3.png',
  '/images/4.png',
  '/images/5.png',
  '/images/7.png',
  '/images/8.png',
  '/images/9.png',
  '/images/11.png',
  '/images/12.png',
  '/images/2.png',
  '/images/6.png',
  '/images/13.png',
];

export default function JoinIndustrySection({ locale = 'tr' }) {
  const dict = getDictionary(locale).joinIndustry;
  const ref = useGsapReveal();

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory py-28 md:py-40 overflow-hidden"
      aria-label={dict.ariaLabel}
    >
      {/* Soft top hairline so it reads as continuous from the section above */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="text-center max-w-[900px] mx-auto mb-16 md:mb-24">
          <h2
            className="reveal font-logo italic text-ivory"
            style={{
              fontSize: 'clamp(34px, 5.2vw, 86px)',
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              fontWeight: 500,
            }}
          >
            {dict.title}
          </h2>
          <p
            className="reveal mt-8 md:mt-10 mx-auto max-w-[60ch] font-nav font-light text-ivory/80"
            style={{
              fontSize: 'clamp(14px, 0.98vw, 16px)',
              lineHeight: 1.85,
            }}
          >
            {dict.body}
          </p>
        </div>

        {/* ── Gallery grid ────────────────────────────────────────── */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                className="reveal relative aspect-[4/5] overflow-hidden rounded-[3px] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover object-center transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>

          {/* Bottom blur-to-black bridge into the footer.
              Two stacked layers anchored to the last row:
                1. A backdrop blur masked so it only intensifies near the
                   bottom, frosting the lower edge of the last-row tiles.
                2. A solid linear gradient from transparent → black so the
                   colour fades to match the footer beneath. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38%]"
            style={{
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(10px)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 70%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 70%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38%]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,1) 100%)',
            }}
          />
        </div>

        {/* ── CTA — mirrors the MasterSection pill exactly ─────────── */}
        <div className="reveal relative z-20 mt-16 md:mt-24 flex justify-center">
          <Link
            href={dict.ctaHref}
            className="group relative inline-flex overflow-hidden rounded-full border border-white/20 bg-white px-7 py-4 font-nav text-[12px] font-medium text-charcoal transition-all duration-500 hover:-translate-y-1 hover:border-amber hover:text-black hover:shadow-[0_18px_70px_rgba(239,184,113,0.32)] md:px-10 md:py-5 md:text-[13px]"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">{dict.cta}</span>
          </Link>
        </div>
      </div>

      {/* Final flat black bleed below the gallery so the fade lands on
          pure black before the footer takes over. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-48 bg-black z-0"
      />
    </section>
  );
}
