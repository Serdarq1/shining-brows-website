'use client';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * CertificatesSection — editorial two-column panel modelled on the Phi
 * "Certificates — BoldBrows" composition.
 *
 *   • Left column: the Shining Brows certificates lineup as a single image
 *     (`/images/certificates_together.png`).
 *   • Right column: roman headline + italic counterpoint + a short
 *     descriptive paragraph explaining the certification path.
 *
 * Black background, consistent with the surrounding dark sections. No
 * `tracking-*` / `letterSpacing` styles — type is set by size + weight +
 * italic only.
 * ------------------------------------------------------------------------- */

export default function CertificatesSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).coursesPage;
  const ref = useGsapReveal();

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory overflow-hidden py-28 md:py-36"
      aria-label={dict.certificatesTitle}
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
          {/* ── Left: certificates lineup ─────────────────────────── */}
          <div className="reveal md:col-span-7 lg:col-span-6 relative w-full aspect-[4/3]">
            <Image
              src="/images/certificates_together.png"
              alt="Shining Brows certificates"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-contain object-center drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* ── Right: headline + body ────────────────────────────── */}
          <div className="md:col-span-5 lg:col-span-6 lg:pl-8">
            <h2
              className="reveal font-display text-ivory"
              style={{
                fontSize: 'clamp(40px, 5.6vw, 96px)',
                lineHeight: 1.0,
                fontWeight: 400,
              }}
            >
              {dict.certificatesTitle}
            </h2>
            <p
              className="reveal mt-1 md:mt-2 font-display italic text-ivory"
              style={{
                fontSize: 'clamp(28px, 4vw, 64px)',
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              — {dict.certificatesSubline}
            </p>

            <p
              className="reveal mt-10 md:mt-14 max-w-[44ch] font-nav font-light text-ivory/80"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
            >
              {dict.certificatesBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
