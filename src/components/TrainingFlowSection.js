'use client';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * TrainingFlowSection — quick editorial intro to how the workshops actually
 * unfold. Sits at the top of the certificates block on the courses page.
 *
 *   • Left column: italic Freight title + descriptive paragraph below it.
 *   • Right column: a single editorial image (`/images/certificateimg.png`).
 *
 * Black background, consistent with the surrounding dark sections. No
 * `tracking-*` / `letterSpacing` styles.
 * ------------------------------------------------------------------------- */

export default function TrainingFlowSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).coursesPage;
  const ref = useGsapReveal();

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory overflow-hidden py-28 md:py-36"
      aria-label={dict.trainingTitle}
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

      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* ── Left: title + body ───────────────────────────────── */}
          <div className="md:col-span-6">
            <h2
              className="reveal font-display italic text-ivory"
              style={{
                fontSize: 'clamp(36px, 5vw, 84px)',
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {dict.trainingTitle}
            </h2>
            <p
              className="reveal mt-8 md:mt-10 max-w-[48ch] font-nav font-light text-ivory/82"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
            >
              {dict.trainingBody}
            </p>
          </div>

          {/* ── Right: editorial image ───────────────────────────── */}
          <div className="reveal md:col-span-6 relative w-full aspect-[4/5]">
            <Image
              src="/images/certificateimg.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover object-center rounded-[6px] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
