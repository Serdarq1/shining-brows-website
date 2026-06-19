'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';
import { useGsapReveal } from '@/hooks/useGsapReveal';

function SpinningLogo({ label }) {
  // repeat the label so the circular text reads continuously
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
            id="about-spin-path"
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
          <textPath href="#about-spin-path" startOffset="0">
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

export default function AboutSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).about;
  const ref = useGsapReveal();
  const imageWrapRef = useRef(null);

  useEffect(() => {
    if (!imageWrapRef.current) return;
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
        gsap.fromTo(
          imageWrapRef.current,
          { xPercent: 80, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top bottom',
              end: 'top 20%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      }, imageWrapRef);
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} className="relative bg-black text-ivory overflow-hidden">
      {/* Ambient top wash — base layer so the beams have something to fall onto */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(70% 55% at 60% 12%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 40%, rgba(0,0,0,0) 78%)',
        }}
      />

      {/* Soft top beams — multiple blurred angled gradients to mimic spill light */}
      <div
        aria-hidden
        className="absolute -top-24 left-[18%] w-[340px] h-[110%] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(14deg)',
          transformOrigin: 'top center',
          filter: 'blur(48px)',
          opacity: 0.9,
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 left-[52%] w-[520px] h-[120%] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0) 75%)',
          transform: 'rotate(-10deg)',
          transformOrigin: 'top center',
          filter: 'blur(60px)',
          opacity: 0.85,
        }}
      />
      <div
        aria-hidden
        className="absolute -top-20 right-[12%] w-[260px] h-[100%] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(8deg)',
          transformOrigin: 'top center',
          filter: 'blur(40px)',
          opacity: 0.8,
        }}
      />

      {/* Thin top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-[1600px] mx-auto md:ml-24 px-7 md:px-10 pt-28 md:pt-36 pb-16 md:pb-24 relative">
        <div className="flex items-start justify-between gap-6 mb-4">
          <span className="reveal text-[11px] tracking-[0.24em] font-nav font-semibold text-ivory">
            {dict.eyebrow}
          </span>
          <div className="reveal hidden md:block absolute right-12 top-8">
            <SpinningLogo label={dict.spinningLabel} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <h2
              className="reveal font-logo italic text-ivory"
              style={{
                fontSize: 'clamp(44px, 6.4vw, 96px)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                fontWeight: 500,
              }}
            >
              <span className="block">{dict.headline.line1}</span>
              <span className="block">{dict.headline.line2}</span>
              <span className="block">{dict.headline.line3}</span>
            </h2>

            <p className="reveal mt-8 md:mt-10 md:ml-24 max-w-[480px] text-[15px] md:text-[16px] leading-[1.75] text-ivory/85 font-light">
              {dict.body}
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div
              ref={imageWrapRef}
              className="relative w-full aspect-[4/5] overflow-hidden will-change-transform"
            >
              <div
                aria-hidden
                className="absolute -inset-10 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(55% 45% at 50% 45%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
                  filter: 'blur(24px)',
                }}
              />
              <Image
                src="/images/guzidekorkmaz.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="object-cover object-center"
                priority={false}
              />
            </div>

            {/* Spinning logo — sits below the image on mobile, hidden on
                md+ where it's already shown absolutely in the top corner. */}
            <div className="md:hidden mt-10 flex justify-start">
              <SpinningLogo label={dict.spinningLabel} />
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">
          {dict.stats.map((stat, i) => (
            <div key={i} className="reveal block">
              <div
                className="block font-logo italic text-ivory"
                style={{
                  fontSize: 'clamp(40px, 5.2vw, 84px)',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                  fontWeight: 500,
                }}
              >
                {stat.value}
              </div>
              <div className="block mt-4 md:mt-6 border-t border-white/15" />
              <div className="block mt-4 text-ivory/80">
                <span aria-hidden className="text-amber mr-3">»</span>
                <span className="font-logo italic text-[17px]">
                  {stat.label}
                </span>
              </div>
              {/* Mobile-only spacing below each stat */}
              <div className="md:hidden h-8 last:h-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
