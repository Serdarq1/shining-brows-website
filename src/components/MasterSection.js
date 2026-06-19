'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

const levelStyles = [
  {},
  { imageSrc: '/images/shiningartist_logo.png' },
  { imageSrc: '/images/masterassistant_logo.png' },
  { imageSrc: '/images/mastertrainer_logo.png' },
  { imageSrc: '/images/goldmaster_logo.png' },
];

function StudentBadge() {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden
      className="h-14 w-14 md:h-24 md:w-24"
    >
      <path
        d="M48 12 L82 82 H14 Z"
        fill="transparent"
        stroke="#111111"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M23 82 C35 68 48 62 73 82 Z"
        fill="none"
        stroke="#111111"
        strokeWidth="3"
        opacity="0.18"
      />
    </svg>
  );
}

function LevelCard({ label, imageSrc, className = '' }) {
  return (
    <div className={`reveal group relative min-h-[180px] md:min-h-[300px] rounded-t-[10px] rounded-b-[2px] bg-white text-charcoal shadow-[0_30px_90px_rgba(0,0,0,0.28)] overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 md:h-28 bg-gradient-to-b from-[#eee8e8] to-white"
      />
      <div className="relative flex h-full flex-col items-center justify-start px-3 pt-8 md:px-5 md:pt-16 text-center">
        <div className="transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              width={150}
              height={108}
              aria-hidden
              className="h-14 w-20 object-contain md:h-24 md:w-36"
            />
          ) : (
            <div className='mt-16 md:mt-24' ></div>
          )}
        </div>
        <div
          className="mt-5 md:mt-9 font-display leading-[1.08] transition-transform duration-700 ease-out group-hover:translate-y-1"
          style={{
            fontSize: 'clamp(18px, 4vw, 52px)',
            fontWeight: 400,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function MasterSection({
  locale = 'tr',
  ctaLabel,
  ctaHref,
  variant = 'default',
  title,
  body,
}) {
  const dict = getDictionary(locale).master;
  const ref = useGsapReveal();

  const finalCtaLabel = ctaLabel ?? dict.cta;
  const finalCtaHref = ctaHref ?? dict.ctaHref;

  // ── Plan variant — used on /courses. Title on top, ranks underneath,
  // then a descriptive paragraph, then the same CTA pill. No negative
  // translate-y, no two-up grid; everything sits centred in flow. ──
  if (variant === 'plan') {
    return (
      <section
        ref={ref}
        className="relative bg-black text-ivory pt-28 md:pt-36 pb-28 md:pb-40"
        aria-label={dict.ariaLabel}
      >
        <div className="relative z-10 mx-auto max-w-[1600px] px-7 md:px-10">
          <h2
            className="reveal text-center font-logo italic text-ivory"
            style={{
              fontSize: 'clamp(36px, 6vw, 104px)',
              lineHeight: 1.05,
              fontWeight: 500,
            }}
          >
            {title}
          </h2>

          <div className="reveal mt-14 md:mt-20 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-6">
            {dict.levels.map((label, index) => {
              const isLastOdd =
                index === dict.levels.length - 1 &&
                dict.levels.length % 2 === 1;
              return (
                <LevelCard
                  key={label}
                  label={label}
                  className={isLastOdd ? 'col-span-2 md:col-span-1' : ''}
                  {...levelStyles[index]}
                />
              );
            })}
          </div>

          <p
            className="reveal mt-14 md:mt-20 mx-auto max-w-[60ch] text-center font-nav font-light text-ivory/80"
            style={{ fontSize: 'clamp(15px, 1.05vw, 18px)', lineHeight: 1.85 }}
          >
            {body}
          </p>

          <div className="reveal mt-12 flex justify-center md:mt-16">
            <Link
              href={finalCtaHref}
              className="group relative inline-flex overflow-hidden rounded-full border border-white/20 bg-white px-7 py-4 font-nav text-[12px] font-medium text-charcoal transition-all duration-500 hover:-translate-y-1 hover:border-amber hover:text-black hover:shadow-[0_18px_70px_rgba(239,184,113,0.32)] md:px-10 md:py-5 md:text-[13px]"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">{finalCtaLabel}</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory pb-28 md:pb-40"
      aria-label={dict.ariaLabel}
    >
      <div className="relative z-10 mx-auto grid max-w-[1840px] -translate-y-12 md:-translate-y-[42%] md:mt-0 grid-cols-2 gap-3 px-7 md:grid-cols-5 md:gap-6 md:px-10">
        {dict.levels.map((label, index) => {
          const isLastOdd =
            index === dict.levels.length - 1 && dict.levels.length % 2 === 1;
          return (
            <LevelCard
              key={label}
              label={label}
              className={isLastOdd ? 'col-span-2 md:col-span-1' : ''}
              {...levelStyles[index]}
            />
          );
        })}
      </div>

      <div className="relative z-10 mx-auto mt-12 max-w-[1600px] px-7 md:-mt-28 md:px-10">
        <div className="grid mt-4 grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 lg:col-span-10 xl:col-span-9">
            <h2
              className="reveal font-logo text-ivory uppercase"
              style={{
                fontSize: 'clamp(62px, 10vw, 188px)',
                lineHeight: 0.88,
                fontWeight: 500,
              }}
            >
              {dict.headline}
            </h2>
            <div
              className="reveal mt-4 flex items-baseline gap-4 font-logo italic text-ivory md:mt-6 md:gap-7 w-full max-w-[1200px]"
              style={{
                fontSize: 'clamp(44px, 7.7vw, 144px)',
                lineHeight: 0.95,
                fontWeight: 500,
              }}
            >
              <span
                aria-hidden
                className="inline-block"
                style={{
                  height: 1,
                  width: 'clamp(42px, 6vw, 118px)',
                  background: '#faf7f2',
                  transform: 'translateY(-0.6em)',
                  flex: '0 0 auto',
                }}
              />
              <span>{dict.subline}</span>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-6 md:mt-20 md:gap-10">
          <div className="hidden lg:block lg:col-span-5" />
          <div className="col-span-12 grid gap-8 md:grid-cols-2 md:gap-12 lg:col-span-7">
            <p
              className="reveal max-w-[30ch] font-nav font-light text-ivory/78"
              style={{ fontSize: 'clamp(14px, 0.98vw, 16px)', lineHeight: 1.75 }}
            >
              {dict.body1}
            </p>
            <p
              className="reveal max-w-[30ch] font-nav font-light text-ivory/78"
              style={{ fontSize: 'clamp(14px, 0.98vw, 16px)', lineHeight: 1.75 }}
            >
              {dict.body2}
            </p>
          </div>
        </div>

        <div className="reveal mt-12 flex justify-center md:mt-16">
          <Link
            href={finalCtaHref}
            className="group relative inline-flex overflow-hidden rounded-full border border-white/20 bg-white px-7 py-4 font-nav text-[12px] font-medium text-charcoal transition-all duration-500 hover:-translate-y-1 hover:border-amber hover:text-black hover:shadow-[0_18px_70px_rgba(239,184,113,0.32)] md:px-10 md:py-5 md:text-[13px]"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">{finalCtaLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
