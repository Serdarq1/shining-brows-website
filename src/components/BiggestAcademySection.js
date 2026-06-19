'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * BiggestAcademySection — editorial two-column composition modelled on the
 * Phi Academy "biggest beauty academy in the world" panel.
 *
 *   ┌──────────────────────────────┬─────────────────────────────┐
 *   │  full-bleed portrait image   │  small eyebrow              │
 *   │  (10.png, scroll-parallax)   │  big roman headline         │
 *   │                              │  big italic counterpoint    │
 *   │                              │  body paragraph             │
 *   └──────────────────────────────┴─────────────────────────────┘
 *
 * Headline is split into a roman line and an italic line (Freight) — the
 * italic line carries an em-dash to mirror the reference.
 *
 * Animations:
 *   • image clip-path reveals from the bottom while easing out of a slight
 *     over-scale, all scroll-triggered (intersection at 75%)
 *   • eyebrow / both headline lines / body stagger fade-up via timeline
 *   • the image gets a gentle scroll-scrub parallax once visible
 * ------------------------------------------------------------------------- */

function SpinningLogo({ label }) {
  // Same spinning monogram used in AboutSection on the home page —
  // SVG textPath running around a hidden circle, with the brand mark
  // pinned in the centre.
  const text = label.repeat(3);
  return (
    <div className="relative w-[140px] h-[140px] md:w-[170px] md:h-[170px]">
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow w-full h-full"
        aria-hidden
      >
        <defs>
          <path
            id="biggest-spin-path"
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            fill="none"
          />
        </defs>
        <text
          fill="#faf7f2"
          style={{
            fontFamily: 'var(--font-jost)',
            fontSize: 13,
            letterSpacing: '0.32em',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          <textPath href="#biggest-spin-path" startOffset="0">
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

export default function BiggestAcademySection({ locale = 'tr' }) {
  const dict = getDictionary(locale).biggestAcademy;
  const homeDict = getDictionary(locale).about;

  const sectionRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageInnerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRomanRef = useRef(null);
  const headlineItalicRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set(
            [
              imageWrapRef.current,
              imageInnerRef.current,
              eyebrowRef.current,
              headlineRomanRef.current,
              headlineItalicRef.current,
              bodyRef.current,
            ],
            { opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }
          );
          return;
        }

        // ── Image reveal — clip-path wipe from bottom + slow over-scale ──
        gsap.set(imageWrapRef.current, {
          clipPath: 'inset(100% 0% 0% 0%)',
        });
        gsap.set(imageInnerRef.current, { scale: 1.18 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              once: true,
            },
          })
          .to(imageWrapRef.current, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'power3.inOut',
          })
          .to(
            imageInnerRef.current,
            { scale: 1, duration: 2.2, ease: 'power2.out' },
            0
          );

        // ── Right column — slide in from the right + fade in ──
        const rightTargets = [
          eyebrowRef.current,
          headlineRomanRef.current,
          headlineItalicRef.current,
          bodyRef.current,
        ];
        gsap.set(rightTargets, { opacity: 0, x: 80 });
        gsap.to(rightTargets, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.14,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        });

        // ── Scroll parallax on the image (subtle drift up) ──
        gsap.to(imageInnerRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-ivory overflow-hidden"
      aria-label={dict.ariaLabel}
    >
      {/* faint top hairline so it reads as continuous from the hero above */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      <div className="mx-auto max-w-[1840px] px-5 md:px-10 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ── Left: full-bleed portrait ─────────────────────────────── */}
          <div className="lg:col-span-5 relative">
            <div
              ref={imageWrapRef}
              className="relative w-full aspect-[3/4] overflow-hidden will-change-[clip-path]"
            >
              <div
                ref={imageInnerRef}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src="/images/10.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="object-cover object-center"
                />
              </div>
              {/* tonal lift so the image sits warm against the black */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
                }}
              />
            </div>
          </div>

          {/* ── Right: editorial copy ─────────────────────────────────── */}
          <div className="lg:col-span-7 lg:pl-6">
            <div ref={eyebrowRef}>
              <SpinningLogo label={homeDict.spinningLabel} />
            </div>

            <h2
              ref={headlineRomanRef}
              className="font-display text-ivory mt-7 md:mt-10"
              style={{
                fontSize: 'clamp(38px, 5.6vw, 96px)',
                fontWeight: 400,
                letterSpacing: '-0.015em',
                lineHeight: 1.02,
              }}
            >
              {dict.headlineRoman}
            </h2>

            <h2
              ref={headlineItalicRef}
              className="font-display italic text-ivory mt-1 md:mt-2"
              style={{
                fontSize: 'clamp(38px, 5.6vw, 96px)',
                fontWeight: 400,
                letterSpacing: '-0.015em',
                lineHeight: 1.02,
              }}
            >
              {dict.headlineItalic}
            </h2>

            <p
              ref={bodyRef}
              className="mt-10 md:mt-14 max-w-[44ch] font-nav font-light text-ivory/82"
              style={{
                fontSize: 'clamp(14px, 0.98vw, 16px)',
                lineHeight: 1.85,
              }}
            >
              {dict.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
