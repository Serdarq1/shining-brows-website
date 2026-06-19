'use client';
import { useEffect, useRef } from 'react';
import { getDictionary } from '@/lib/i18n';

const HERO_CONFIG = {
  entranceStagger: 0.13,
  entranceDelay: 0.3,
  videoDarkness: 0.45,
};

export default function Hero({ locale = 'tr' }) {
  const dict = getDictionary(locale).hero;

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);
  const ctaRef = useRef(null);
  const metaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ctx;
    let cancelled = false;

    if (videoRef.current && prefersReducedMotion) {
      videoRef.current.pause();
    }

    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled) return;
      const gsap = gsapMod.default;

      ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set(
            [
              eyebrowRef.current,
              headlineRef.current,
              bodyRef.current,
              ctaRef.current,
              metaRef.current,
              scrollIndicatorRef.current,
            ],
            { opacity: 1, y: 0 }
          );
          if (headlineRef.current) {
            gsap.set(headlineRef.current.querySelectorAll('.hero__word'), {
              opacity: 1,
              y: 0,
            });
          }
          return;
        }

        gsap.set(
          [
            eyebrowRef.current,
            headlineRef.current,
            bodyRef.current,
            ctaRef.current,
            metaRef.current,
            scrollIndicatorRef.current,
          ],
          { opacity: 0, y: 12 }
        );

        if (headlineRef.current) {
          gsap.set(headlineRef.current.querySelectorAll('.hero__word'), {
            opacity: 0,
            y: 20,
          });
        }

        const tl = gsap.timeline({ delay: HERO_CONFIG.entranceDelay });

        tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });

        if (headlineRef.current) {
          tl.to(
            headlineRef.current.querySelectorAll('.hero__word'),
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              stagger: HERO_CONFIG.entranceStagger,
            },
            '-=0.2'
          );
        }

        tl.to(bodyRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5);
        tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.65);
        tl.to(metaRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.1);
        tl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.8 }, 1.3);
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
      className="relative w-full h-screen overflow-hidden bg-charcoal"
      aria-label="Shining Brows hero"
    >
      <video
        ref={videoRef}
        src="/videos/Remover.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: `rgba(0,0,0,${HERO_CONFIG.videoDarkness})` }}
        aria-hidden
      />

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(26,20,16,0.55) 0%, transparent 55%)' }}
        aria-hidden
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-[2] pointer-events-none"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(26,20,16,0.85) 0%, transparent 100%)',
        }}
        aria-hidden
      />

      <div
        ref={eyebrowRef}
        className="absolute z-10 top-28 md:top-44 left-5 md:left-10 text-[11px] md:text-[13px] uppercase tracking-[0.18em] md:tracking-[0.22em] text-amber font-semibold"
      >
        {dict.eyebrow}
      </div>

      <div className="absolute z-10 left-5 md:left-14 right-5 md:right-auto top-[42%] md:top-1/3 -translate-y-1/2 max-w-[calc(100vw-2.5rem)] md:max-w-[820px]">
        <div
          ref={headlineRef}
          aria-hidden
          className="font-logo italic text-hero text-ivory"
          style={{ fontWeight: 500, visibility: 'hidden' }}
        >
          <span className="hero__line block">&nbsp;</span>
          <span className="hero__line block">&nbsp;</span>
          <span className="hero__line block">&nbsp;</span>
        </div>

        <p
          ref={bodyRef}
          className="max-w-[320px] md:max-w-[360px] text-2xl md:text-3xl leading-[1.45] md:leading-[1.65] text-ivory italic font-logo"
        >
          {dict.body}
        </p>
      </div>

      <div
        ref={ctaRef}
        className="absolute z-10 bottom-16 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-5 md:left-auto right-5 md:right-14 flex flex-col items-start md:items-end gap-3 md:gap-5"
      >
        <a
          href="/workshops"
          className="group inline-flex items-center text-2xl md:text-3xl italic font-logo text-ivory pb-[3px] md:pb-[5px] border-b border-white/40 hover:text-zinc-300 transition-colors"
        >
          <span>{dict.ctaPrimary}</span>
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
            ↗
          </span>
        </a>

        <a
          href="/experts"
          className="group inline-flex items-center text-2xl md:text-3xl italic font-logo text-ivory border-b border-white/40 pb-[3px] md:pb-[5px] hover:text-zinc-300 transition-colors"
        >
          <span>{dict.ctaSecondary}</span>
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
