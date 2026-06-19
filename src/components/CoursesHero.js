'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';
import { RANK_LOGOS } from '@/lib/trainers';

/* ---------------------------------------------------------------------------
 * CoursesHero — single editorial template used for the /courses page.
 *
 *   • Big white SHINING BROWS monogram at the top.
 *   • Title underneath: "What awaits you in Shining Brows Workshops?".
 *   • A scattered, intentionally-asymmetric arrangement of master trainer
 *     portraits beneath the title. Each card shows the trainer's name +
 *     country flag and their rank monogram. Only Dilek Ceyhan is a Gold
 *     Master; everyone else is a Master Trainer (founder isn't shown in
 *     the scatter — that role is featured separately on the about page).
 *   • All animations done with GSAP — logo + title + scattered cards
 *     fade-in with subtle scale + stagger, plus an ambient float on
 *     each card so the canvas reads as quietly alive.
 *
 * On mobile the scatter collapses to a clean 2-column grid so the page
 * stays readable. Position metadata only kicks in at md+.
 * ------------------------------------------------------------------------- */

// Every trainer (including Güzide as founder) appears in the scatter.
// `trainers` arrives via props now (from Supabase). Kept for prop default.
const SCATTERED_TRAINERS = [];

// Hand-tuned positions for the desktop scatter — top/left as %s of the
// container, width via clamp so it scales with viewport. Güzide (the
// founder) anchors the centre-top slot, slightly larger; the rest fan
// around the canvas.
const POSITIONS = [
  { top: '0%',  left: '38%', w: 'clamp(220px, 18vw, 320px)', rot:  0 }, // 1. Güzide — anchor
  { top: '14%', left: '4%',  w: 'clamp(170px, 14vw, 250px)', rot: -6 }, // 2. Dilek
  { top: '18%', left: '74%', w: 'clamp(180px, 15vw, 270px)', rot:  5 }, // 3. Ebru
  { top: '44%', left: '14%', w: 'clamp(180px, 15vw, 270px)', rot: -4 }, // 4. Azize
  { top: '48%', left: '62%', w: 'clamp(170px, 14vw, 250px)', rot:  4 }, // 5. Zeynep
  { top: '76%', left: '6%',  w: 'clamp(190px, 16vw, 280px)', rot: -2 }, // 6. Gözde
  { top: '78%', left: '66%', w: 'clamp(190px, 16vw, 280px)', rot:  3 }, // 7. Feride
];

function TrainerCard({ trainer, countryLabel, rankLabel, rankLogo, refSetter }) {
  const initials = (trainer.name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('tr-TR');

  return (
    <div
      ref={refSetter}
      className="trainer-card relative w-full aspect-[3/4] overflow-hidden rounded-[6px] shadow-[0_30px_80px_rgba(0,0,0,0.55)] bg-neutral-900 will-change-transform"
    >
      {trainer.photo ? (
        <Image
          src={trainer.photo}
          alt={trainer.name}
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#efb871] font-nav text-4xl font-semibold text-black">
          {initials}
        </div>
      )}

      {/* Dark wash anchored to the bottom so the meta block stays legible
          on top of any portrait. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Name / flag / rank — overlaid on the lower portion of the card */}
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex flex-col items-center text-center text-ivory">
        <div className="flex items-baseline gap-2">
          <span
            className="font-display italic"
            style={{ fontSize: 'clamp(16px, 1.3vw, 22px)', fontWeight: 500, lineHeight: 1.1 }}
          >
            {trainer.name}
          </span>
          <span
            aria-label={countryLabel}
            title={countryLabel}
            style={{ fontSize: '16px', lineHeight: 1 }}
          >
            {trainer.flag}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {rankLogo && (
            <div className="relative h-5 w-5 md:h-6 md:w-6">
              <Image
                src={rankLogo}
                alt=""
                fill
                sizes="28px"
                className="object-contain object-center"
              />
            </div>
          )}
          <span
            className="font-nav text-ivory/90"
            style={{ fontSize: '11px', fontWeight: 600 }}
          >
            {rankLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CoursesHero({ locale = 'tr', trainers = SCATTERED_TRAINERS }) {
  const dict = getDictionary(locale).coursesPage;
  const findCourseDict = getDictionary(locale).findCourse;

  const sectionRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const registerCard = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled) return;
      const gsap = gsapMod.default;

      ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set([logoRef.current, titleRef.current, ...cardsRef.current], {
            opacity: 1,
            y: 0,
            scale: 1,
          });
          return;
        }

        // Master timeline — logo first, title word-mask, then scatter.
        const tl = gsap.timeline({ delay: 0.15 });

        tl.from(
          logoRef.current,
          { opacity: 0, y: -24, scale: 0.94, duration: 1.0, ease: 'power3.out' },
          0
        );

        const words = titleRef.current?.querySelectorAll('.course-word') ?? [];
        tl.from(
          words,
          { yPercent: 110, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07 },
          0.45
        );

        tl.from(
          cardsRef.current,
          { opacity: 0, y: 40, scale: 0.9, duration: 1.0, ease: 'power3.out', stagger: 0.12 },
          0.9
        );

        // Ambient float — each card drifts on its own slow yoyo cycle.
        cardsRef.current.forEach((el, i) => {
          gsap.to(el, {
            y: '+=' + (i % 2 === 0 ? -8 : -12),
            duration: 3.6 + (i % 3) * 0.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 1.4 + i * 0.15,
          });
        });
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  // Mask-reveal word splitter for the headline.
  const renderWords = (text) => {
    const tokens = text.split(' ');
    return tokens.map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-bottom"
        style={{ paddingBottom: '0.1em' }}
      >
        <span className="course-word inline-block will-change-transform">
          {word}
          {i < tokens.length - 1 ? ' ' : ''}
        </span>
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-ivory overflow-hidden pt-20 md:pt-28 pb-32 md:pb-40"
      aria-label={dict.ariaLabel}
    >
      {/* faint top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      {/* ── Large white brand logo ─────────────────────────────────── */}
      <div
        ref={logoRef}
        className="relative mx-auto w-full max-w-[460px] md:max-w-[680px] lg:max-w-[820px] h-24 md:h-36 lg:h-44 px-7"
      >
        <Image
          src="/images/logo_white_with_text.png"
          alt="SHINING BROWS"
          fill
          sizes="(min-width: 1024px) 820px, 80vw"
          className="object-contain object-center"
          priority
        />
      </div>

      {/* ── Title ──────────────────────────────────────────────────── */}
      <h1
        ref={titleRef}
        className="mt-6 md:mt-8 mx-auto max-w-[1100px] px-7 md:px-10 text-center font-display italic text-ivory"
        style={{
          fontSize: 'clamp(30px, 4.8vw, 76px)',
          lineHeight: 1.12,
          fontWeight: 500,
        }}
      >
        {renderWords(dict.title)}
      </h1>

      {/* ── Trainer scatter ────────────────────────────────────────── */}
      <div className="relative mt-16 md:mt-24 mx-auto max-w-[1320px] px-5">
        <div className="trainer-scatter grid grid-cols-2 gap-x-5 gap-y-12 md:gap-y-0 md:block md:relative md:h-[940px] lg:h-[1020px]">
          {trainers.map((t, i) => {
            const pos = POSITIONS[i] || POSITIONS[0];
            const countryLabel = dict.countries[t.countryKey] || t.countryKey;
            const rankLabel =
              findCourseDict.statuses[t.rank] || t.rank;
            return (
              <div
                key={t.id}
                className="trainer-slot md:absolute"
                style={{
                  '--top': pos.top,
                  '--left': pos.left,
                  '--w': pos.w,
                  '--rot': `${pos.rot}deg`,
                }}
              >
                <TrainerCard
                  trainer={t}
                  countryLabel={countryLabel}
                  rankLabel={rankLabel}
                  rankLogo={RANK_LOGOS[t.rank]}
                  refSetter={registerCard}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* desktop-only scatter positioning, kept here so it stays
          colocated with the JSX. Mobile is a clean 2-col grid. */}
      <style jsx>{`
        @media (min-width: 768px) {
          .trainer-slot {
            top: var(--top);
            left: var(--left);
            width: var(--w);
            transform: rotate(var(--rot));
          }
          .trainer-slot :global(.trainer-card) {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
