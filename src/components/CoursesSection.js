'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * Courses section — composition modelled on the Phi Academy "Courses" layout:
 *   - Huge stacked editorial headline (Freight display + italic counterpoint)
 *   - Two-column body copy aligned to the right
 *   - Grid of course cards with full-bleed images, dark gradient overlay,
 *     ivory title + uppercase subtitle pinned to the lower-left of each card
 *   - "See All" pill button below
 *
 * Animations: scroll-driven via the existing `useGsapReveal` hook + Lenis
 * smooth scroll already wired in `LenisProvider`. Any element with the
 * `.reveal` class fades up on enter, once.
 *
 * Images: drop course photos into /public/images/courses/{key}.jpg and pass
 * the path via the `imageSrc` field on each i18n item to swap out the
 * placeholder gradient.
 * ------------------------------------------------------------------------- */

function CourseCard({ name, subtitle, href, imageSrc }) {
  return (
    <Link
      href={href || '#'}
      className="reveal group relative block aspect-[4/5] overflow-hidden rounded-[2px] shadow-[0_28px_70px_rgba(255,255,255,0.88),0_14px_34px_rgba(255,255,255,0.72)]"
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 90vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        // Premium placeholder — sepia gradient so the card reads as
        // intentional rather than empty while real photos haven't landed.
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
          style={{
            background:
              'linear-gradient(150deg, #4a3f33 0%, #2a221b 55%, #14100c 100%)',
          }}
        />
      )}

      {/* Dark wash anchored to the bottom so the title stays legible
          regardless of the underlying photo. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.78) 100%)',
        }}
      />

      {/* Card label */}
      <div className="absolute left-4 bottom-4 right-4 md:left-7 md:bottom-7 md:right-7 text-ivory">
        <div
          className="font-display italic"
          style={{
            fontSize: 'clamp(15px, 1.9vw, 30px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </div>
        {subtitle && (
          <div
            className="font-nav italic uppercase mt-1 md:mt-2 text-ivory/85"
            style={{
              fontSize: 'clamp(9px, 0.78vw, 12px)',
              letterSpacing: '0.2em',
              fontWeight: 600,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Hover arrow — appears top-right */}
      <span
        aria-hidden
        className="absolute top-3 right-3 md:top-6 md:right-6 text-ivory text-[16px] md:text-[20px] opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
      >
        ↗︎
      </span>
    </Link>
  );
}

export default function CoursesSection({ locale = 'tr', showSeeAll = true }) {
  const dict = getDictionary(locale).courses;
  const ref = useGsapReveal();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden text-charcoal py-28 md:py-40"
      style={{ backgroundColor: '#F7F4EE' }}
      aria-label="Workshops"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[-72px] h-72 bg-white/80 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
        {/* ── Editorial header ─────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <h2
              className="reveal font-logo text-charcoal uppercase"
              style={{
                fontSize: 'clamp(44px, 13vw, 240px)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                fontWeight: 500,
              }}
            >
              {dict.eyebrow}
            </h2>
            <div
              className="reveal font-logo italic text-charcoal mt-3 md:mt-5 flex items-baseline gap-3 md:gap-7"
              style={{
                fontSize: 'clamp(30px, 11vw, 210px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                fontWeight: 500,
              }}
            >
              <span
                aria-hidden
                className="inline-block"
                style={{
                  height: 1,
                  width: 'clamp(24px, 7vw, 130px)',
                  background: '#111',
                  transform: 'translateY(-0.6em)',
                  flex: '0 0 auto',
                }}
              />
              <span className="break-words">{dict.italicLabel}</span>
            </div>
          </div>
        </div>

        {/* ── Two-column body copy on the right ────────────────────────── */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mt-16 md:mt-24">
          <div className="hidden lg:block lg:col-span-5" />
          <div className="col-span-12 lg:col-span-7 grid md:grid-cols-2 gap-8 md:gap-12">
            <p
              className="reveal font-nav font-light text-charcoal max-w-[28ch]"
              style={{
                fontSize: 'clamp(14px, 0.98vw, 16px)',
                lineHeight: 1.75,
              }}
            >
              {dict.body1}
            </p>
            <p
              className="reveal font-nav font-light text-charcoal max-w-[28ch]"
              style={{
                fontSize: 'clamp(14px, 0.98vw, 16px)',
                lineHeight: 1.75,
              }}
            >
              {dict.body2}
            </p>
          </div>
        </div>

        {/* ── Course cards grid ────────────────────────────────────────── */}
        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {dict.items.map((item, i) => (
            <CourseCard
              key={i}
              name={item.name}
              subtitle={item.subtitle}
              href={item.href}
              imageSrc={item.imageSrc}
            />
          ))}
        </div>

        {/* ── See all button (hidden on /courses where the page IS the
              full course list) ────────────────────────────────────── */}
        {showSeeAll && (
          <div className="reveal mt-14 md:mt-20 flex justify-center">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-3 bg-charcoal text-ivory uppercase font-nav font-semibold rounded-full px-9 md:px-12 py-4 md:py-5 hover:bg-charcoal-soft transition-colors"
              style={{
                fontSize: 'clamp(11px, 0.85vw, 13px)',
                letterSpacing: '0.24em',
              }}
            >
              <span>{dict.seeAll}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                ↗︎
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
