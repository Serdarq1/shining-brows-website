'use client';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * ProductsValuesSection — editorial statement panel modelled on the Phi
 * "CLIENTS ALWAYS — COME FIRST" composition.
 *
 *   • Massive freight headline filling the canvas — roman + italic mix
 *     split across two lines, em-dash on the italic line.
 *   • Body paragraph anchored to the lower-right, max ~44ch, that
 *     elaborates on the four pillars: natural products, results,
 *     experts, clients.
 *
 * Black background to dock cleanly under the 3D archive hero.
 * ------------------------------------------------------------------------- */

export default function ProductsValuesSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).productsValues;
  const ref = useGsapReveal();

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory pt-32 md:pt-48 pb-28 md:pb-40 overflow-hidden"
      aria-label={dict.ariaLabel}
    >
      {/* Faint top hairline to bridge into the gallery above */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
        {/* ── Headline ───────────────────────────────────────────── */}
        <h2
          className="reveal font-logo text-ivory uppercase"
          style={{
            fontSize: 'clamp(56px, 12vw, 240px)',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            fontWeight: 500,
          }}
        >
          <span className="block">{dict.headlineLine1}</span>
          <span className="block italic">{dict.headlineLine2}</span>
        </h2>

        {/* ── Product shot (left) + descriptive body (right) ─────── */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="reveal relative md:col-span-6 lg:col-span-5 w-full aspect-square">
            <Image
              src="/images/remover.png"
              alt="SHINING BROWS Hybrid Remover"
              fill
              sizes="(min-width: 1024px) 38vw, 80vw"
              className="object-contain object-center"
            />
          </div>

          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p
              className="reveal max-w-[44ch] font-nav font-light text-ivory/82"
              style={{
                fontSize: 'clamp(15px, 1.05vw, 18px)',
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
