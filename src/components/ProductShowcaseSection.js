'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * ProductShowcaseSection — switchable product feature.
 *
 *   • Active product photo sits centre-left (centre-stacked on mobile),
 *     gently floating up/down via a yoyo GSAP tween.
 *   • Active product's title / italic subline / description / ingredients
 *     sit on the right column.
 *   • A floating italic-Freight watermark of the active product's name
 *     marquees across the top of the canvas at low opacity.
 *   • A spinning brand monogram pins to the top-right of the section.
 *   • A thumbnail strip at the bottom lets the user pick any of the
 *     eight products. Selecting one fires a GSAP fade/translate
 *     transition on the image *and* the details column for a smooth
 *     swap.
 * ------------------------------------------------------------------------- */

const MARQUEE_DURATION = 38; // seconds per full marquee pass
const FLOAT_DISTANCE = 14;   // px of vertical drift on the product
const FLOAT_DURATION = 4.2;  // seconds per float cycle

function SpinningLogo({ label }) {
  // SVG textPath orbiting a hidden circle, with the white monogram
  // pinned to the centre — same construction used on the home page.
  const text = label.repeat(3);
  return (
    <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px]">
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow w-full h-full"
        aria-hidden
      >
        <defs>
          <path
            id="product-showcase-spin-path"
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            fill="none"
          />
        </defs>
        <text
          fill="#faf7f2"
          style={{
            fontFamily: 'var(--font-jost)',
            fontSize: 13,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <textPath href="#product-showcase-spin-path" startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <Image
        src="/images/logo_white.png"
        alt=""
        width={220}
        height={80}
        className="absolute inset-0 m-auto w-[58%] h-auto object-contain pointer-events-none"
      />
    </div>
  );
}

export default function ProductShowcaseSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).productShowcase;
  const aboutDict = getDictionary(locale).about;
  const items = dict.items;

  const sectionRef = useGsapReveal();
  const marqueeRef = useRef(null);
  const productFloatRef = useRef(null);
  const productImageWrapRef = useRef(null);
  const detailsRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  // ── Warm the browser cache with every product PNG up front so the
  //    detail-view swap doesn't have to wait on a network round-trip
  //    every time the user clicks a thumbnail. Runs once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    items.forEach((item) => {
      const img = new window.Image();
      img.src = item.image;
    });
  }, [items]);

  // ── Constant ambient motion (marquee + float) ─────────────────────
  useEffect(() => {
    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled) return;
      const gsap = gsapMod.default;

      ctx = gsap.context(() => {
        if (marqueeRef.current) {
          gsap.to(marqueeRef.current, {
            xPercent: -50,
            duration: MARQUEE_DURATION,
            ease: 'none',
            repeat: -1,
          });
        }
        if (productFloatRef.current) {
          gsap.to(productFloatRef.current, {
            y: -FLOAT_DISTANCE,
            duration: FLOAT_DURATION,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        }
      });
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  // ── Swap transition fires whenever activeIndex changes ────────────
  useEffect(() => {
    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled) return;
      const gsap = gsapMod.default;

      ctx = gsap.context(() => {
        if (productImageWrapRef.current) {
          gsap.fromTo(
            productImageWrapRef.current,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }
          );
        }
        if (detailsRef.current) {
          gsap.fromTo(
            detailsRef.current.children,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.07,
            }
          );
        }
      });
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [activeIndex]);

  const marqueeWords = Array.from({ length: 6 }, () => active.floatingName);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-ivory overflow-hidden py-28 md:py-36"
      aria-label={dict.ariaLabel}
    >
      {/* Faint top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      {/* ── Spinning monogram, top-right ──────────────────────────── */}
      <div className="pointer-events-none absolute top-6 right-6 md:top-10 md:right-10 z-20">
        <SpinningLogo label={aboutDict.spinningLabel} />
      </div>

      {/* ── Floating product-name marquee ─────────────────────────── */}
      <div className="pointer-events-none absolute inset-x-0 top-14 md:top-20 z-0">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={`${active.id}-${i}`}
              className="font-display italic text-ivory/10 leading-none pr-[0.4em]"
              style={{ fontSize: 'clamp(80px, 14vw, 240px)', fontWeight: 400 }}
            >
              {word}
              <span className="px-[0.3em] text-ivory/10">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10 mt-24 md:mt-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* ── Active product image (left on desktop) ─────────── */}
          <div className="md:col-span-6 lg:col-span-7 relative aspect-square">
            <div
              ref={productFloatRef}
              className="absolute inset-0 will-change-transform"
            >
              <div
                ref={productImageWrapRef}
                className="absolute inset-0"
                key={active.id}
              >
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className="object-contain object-center"
                  priority
                  fetchPriority="high"
                  quality={85}
                />
              </div>
            </div>
          </div>

          {/* ── Active product details (right on desktop) ──────── */}
          <div
            ref={detailsRef}
            className="md:col-span-6 lg:col-span-5"
            key={active.id}
          >
            <h3
              className="font-logo text-ivory"
              style={{
                fontSize: 'clamp(36px, 4.4vw, 76px)',
                lineHeight: 0.95,
                fontWeight: 500,
              }}
            >
              {active.name}
            </h3>
            <p
              className="mt-1 md:mt-2 font-logo italic text-ivory"
              style={{
                fontSize: 'clamp(22px, 2.6vw, 44px)',
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              {active.subline}
            </p>

            <p
              className="mt-8 md:mt-10 max-w-[42ch] font-nav font-light text-ivory/82"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
            >
              {active.description}
            </p>

            <div className="mt-10 md:mt-14">
              <span
                className="block font-nav text-ivory/60"
                style={{ fontSize: '12px', fontWeight: 600 }}
              >
                {dict.ingredientsLabel}
              </span>
              <ul className="mt-5 space-y-2.5">
                {active.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-baseline font-nav text-ivory/85"
                    style={{ fontSize: '14px' }}
                  >
                    <span aria-hidden className="text-amber mr-3">»</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Thumbnail picker ──────────────────────────────────── */}
        <div className="reveal mt-20 md:mt-28 grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-5">
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={item.name}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'group flex flex-col items-center transition-all duration-500',
                  isActive ? 'opacity-100' : 'opacity-55 hover:opacity-90',
                ].join(' ')}
              >
                <div
                  className={[
                    'relative w-full aspect-square p-2',
                    'border-b transition-colors duration-500',
                    isActive ? 'border-amber' : 'border-ivory/15',
                  ].join(' ')}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="120px"
                    loading="eager"
                    quality={70}
                    className={[
                      'object-contain object-center transition-transform duration-700',
                      isActive ? 'scale-105' : 'group-hover:scale-105',
                    ].join(' ')}
                  />
                </div>
                <p
                  className={[
                    'mt-3 font-nav transition-colors duration-500 text-center',
                    isActive ? 'text-ivory' : 'text-ivory/70',
                  ].join(' ')}
                  style={{ fontSize: '12px', fontWeight: 600 }}
                >
                  {item.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
