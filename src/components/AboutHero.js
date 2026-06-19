'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * AboutHero — editorial split hero modelled on the Toteme "A Modern Uniform"
 * page. Two full-bleed portrait images sit side-by-side; a small monogram
 * floats centred-top, eyebrow + body copy sits top-left, an "About" label
 * pins to mid-right, and a vast Freight headline runs across the bottom.
 *
 * Animations are driven by GSAP. Lenis smooth scroll is already wired
 * globally via LenisProvider so we just plug into scroll position.
 * ------------------------------------------------------------------------- */

export default function AboutHero({ locale = 'tr' }) {
  const dict = getDictionary(locale).aboutPage;

  const sectionRef = useRef(null);
  const imageLeftRef = useRef(null);
  const imageRightRef = useRef(null);
  const monogramRef = useRef(null);
  const eyebrowRef = useRef(null);
  const dividerRef = useRef(null);
  const bodyRef = useRef(null);
  const sideLabelRef = useRef(null);
  const headlineLeftRef = useRef(null);
  const headlineRightRef = useRef(null);

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
              imageLeftRef.current,
              imageRightRef.current,
              monogramRef.current,
              eyebrowRef.current,
              dividerRef.current,
              bodyRef.current,
              sideLabelRef.current,
              headlineLeftRef.current,
              headlineRightRef.current,
            ],
            { opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }
          );
          return;
        }

        // Image reveal — clip-path wipe + a slow zoom out from over-scale.
        gsap.set(imageLeftRef.current, {
          clipPath: 'inset(0% 100% 0% 0%)',
          scale: 1.18,
        });
        gsap.set(imageRightRef.current, {
          clipPath: 'inset(0% 0% 0% 100%)',
          scale: 1.18,
        });

        const tl = gsap.timeline({ delay: 0.15 });

        tl.to(
          [imageLeftRef.current, imageRightRef.current],
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'power3.inOut',
          },
          0
        ).to(
          [imageLeftRef.current, imageRightRef.current],
          {
            scale: 1,
            duration: 2.2,
            ease: 'power2.out',
          },
          0
        );

        // Top-of-frame monogram + side label
        gsap.set([monogramRef.current, sideLabelRef.current], {
          opacity: 0,
          y: -8,
        });
        tl.to(
          [monogramRef.current, sideLabelRef.current],
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0.6
        );

        // Eyebrow + divider + body — stacked fade-up
        gsap.set([eyebrowRef.current, dividerRef.current, bodyRef.current], {
          opacity: 0,
          y: 18,
        });
        tl.to(
          [eyebrowRef.current, dividerRef.current, bodyRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          },
          0.75
        );

        // Bottom display headline — words slide up with the separator
        // splitting the two phrases.
        const leftWords =
          headlineLeftRef.current?.querySelectorAll('.about-word') ?? [];
        const rightWords =
          headlineRightRef.current?.querySelectorAll('.about-word') ?? [];
        gsap.set([...leftWords, ...rightWords], { yPercent: 110, opacity: 0 });

        tl.to(
          leftWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.06,
          },
          0.9
        ).to(
          rightWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.06,
          },
          '-=0.6'
        );

        // Parallax on scroll — both images drift slightly upward as you
        // scroll past, keeping the bottom headline in command.
        gsap.to(imageLeftRef.current, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
        gsap.to(imageRightRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
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

  const renderWords = (text) =>
    text.split(' ').map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-bottom"
        style={{ paddingBottom: '0.08em' }}
      >
        <span className="about-word inline-block will-change-transform">
          {word}
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black text-ivory"
      aria-label={dict.ariaLabel}
    >
      {/* ── Image columns ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 grid grid-cols-2">
        <div
          ref={imageLeftRef}
          className="relative h-full w-full overflow-hidden will-change-transform"
        >
          <Image
            src="/images/2.png"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
        <div
          ref={imageRightRef}
          className="relative h-full w-full overflow-hidden will-change-transform"
        >
          <Image
            src="/images/13.png"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Base darkening pass — flat tint so the photos read as moodier
          editorial without losing detail. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.32)' }}
      />
      {/* Vertical wash — heavier on top + bottom for type legibility */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.08) 22%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.72) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.32) 100%)',
        }}
      />

      {/* ── Centered monogram (top) ────────────────────────────────────── */}
      <div
        ref={monogramRef}
        className="absolute z-10 top-6 md:top-10 left-1/2 -translate-x-1/2"
      >
        <Image
          src="/images/logo_white.png"
          alt="SHINING BROWS"
          width={120}
          height={48}
          className="h-7 w-auto md:h-10 object-contain"
          priority
        />
      </div>


      {/* ── Mid-right side label ───────────────────────────────────────── */}
      <div
        ref={sideLabelRef}
        className="absolute z-10 right-5 md:right-10 top-1/2 -translate-y-1/2 flex items-center gap-3"
      >
        <span
          className="font-nav uppercase text-ivory"
          style={{
            fontSize: '11px',
            letterSpacing: '0.28em',
            fontWeight: 600,
          }}
        >
          {dict.sideLabel}
        </span>
        <span
          aria-hidden
          className="font-display text-ivory text-[18px] leading-none"
          style={{ fontWeight: 400 }}
        >
          |||
        </span>
      </div>

      {/* ── Bottom display headline — stacked, top centered, bottom right ── */}
      <div className="absolute z-10 left-0 right-0 bottom-6 md:bottom-10 px-5 md:px-10">
        <h1
          ref={headlineLeftRef}
          className="font-display italic text-ivory text-center"
          style={{
            fontSize: 'clamp(40px, 7vw, 132px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 0.92,
          }}
        >
          {renderWords(dict.headlineLeft)}
        </h1>

        <h2
          ref={headlineRightRef}
          className="font-display italic text-ivory text-right mt-4 md:mt-2 break-words"
          style={{
            fontSize: 'clamp(40px, 7vw, 132px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 0.92,
          }}
        >
          {renderWords(dict.headlineRight)}
        </h2>
      </div>
    </section>
  );
}
