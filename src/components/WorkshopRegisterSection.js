'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';
import { submitWorkshopLead } from '@/lib/db/leads';

/* ---------------------------------------------------------------------------
 * WorkshopRegisterSection — the "Kayıt Ol" / "Register" landing.
 *
 * Layout (black, single column, centred):
 *   1. Master profile photo at the top, large circular crop.
 *   2. Master name in italic Freight + status label.
 *   3. Two icon-badge tiles (Location · Date) mirroring the reference —
 *      white circles with a pin / calendar glyph, label small caps,
 *      value below in italic Freight.
 *   4. "Become a Shining Artist" Freight italic headline.
 *   5. Form: name, surname, phone, privacy-consent checkbox.
 *   6. Amber CTA submit button.
 *
 * Submit is intentionally local-only for now (the team can wire it to
 * the CRM / Mailchimp / wherever later). A polite success card replaces
 * the form when the submission resolves.
 * ------------------------------------------------------------------------- */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="#1a1410" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="#1a1410" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
    </svg>
  );
}

function MetaBadge({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 md:gap-5">
      <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-ivory shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        {icon}
      </div>
      <p
        className="font-nav uppercase text-ivory/65"
        style={{ fontSize: '11px', fontWeight: 600 }}
      >
        {label}
      </p>
      <p
        className="font-nav uppercase text-ivory"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        {value}
      </p>
    </div>
  );
}

const INPUT_CLASSES = [
  'w-full bg-transparent border-b border-ivory/30 text-ivory',
  'font-nav text-[15px] py-3 px-1',
  'placeholder:text-ivory/40 focus:outline-none focus:border-ivory',
  'transition-colors',
].join(' ');

const LABEL_CLASSES = [
  'block font-nav uppercase text-ivory/60',
  'text-[10px] font-semibold mb-2',
].join(' ');

export default function WorkshopRegisterSection({ workshop, locale = 'tr', rankLogos = {} }) {
  const ref = useGsapReveal();
  const dict = getDictionary(locale).workshop;
  const findCourseDict = getDictionary(locale).findCourse;

  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.phone || !form.consent) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitWorkshopLead({
        name: form.name,
        surname: form.surname,
        phone: form.phone,
        consent: form.consent,
        workshop,
      });
      setSubmitted(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[workshop lead]', err);
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived display fields ──────────────────────────────────────
  const statusLabel = findCourseDict.statuses[workshop.master.status] || workshop.master.status;
  const monthName = findCourseDict.monthNames[workshop.monthIndex];
  const monthShort = monthName.slice(0, 3);
  const dateValue = `${workshop.day} ${monthShort} ${workshop.year}`;
  const locationValue =
    workshop.type === 'online'
      ? dict.onlineLabel.toUpperCase()
      : [workshop.location, workshop.country].filter(Boolean).join(', ').toUpperCase();
  const rankLogo = rankLogos[workshop.master.status];

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory overflow-hidden pt-28 md:pt-36 pb-28 md:pb-36"
      aria-label={dict.ariaLabel}
    >
      {/* Soft top hairline for continuity */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[760px] mx-auto px-7 md:px-10 text-center">
        {/* ── Master profile photo ──────────────────────────────── */}
        <div className="reveal mx-auto relative h-32 w-32 md:h-44 md:w-44 rounded-full overflow-hidden ring-[6px] ring-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] bg-neutral-900">
          <Image
            src={workshop.master.photo}
            alt={workshop.master.name}
            fill
            sizes="180px"
            priority
            className="object-cover object-center"
          />
        </div>

        {/* ── Name ───────────────────────────────────────────────── */}
        <h1
          className="reveal mt-8 md:mt-10 font-display italic text-ivory"
          style={{
            fontSize: 'clamp(34px, 4.4vw, 64px)',
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          {workshop.master.name}
        </h1>

        {/* ── Status + rank logo ─────────────────────────────────── */}
        <div className="reveal mt-5 md:mt-7 flex flex-col items-center gap-3">
          <p
            className="font-nav uppercase text-ivory"
            style={{ fontSize: '12px', fontWeight: 600 }}
          >
            {statusLabel}
          </p>
          {rankLogo && (
            <div className="relative h-10 w-10 md:h-12 md:w-12">
              <Image
                src={rankLogo}
                alt=""
                fill
                sizes="48px"
                className="object-contain object-center"
              />
            </div>
          )}
        </div>

        {/* ── Hairline separator ─────────────────────────────────── */}
        <div
          aria-hidden
          className="reveal mx-auto mt-14 md:mt-20 h-px bg-ivory/15"
          style={{ width: '100%' }}
        />

        {/* ── Location + Date badges ─────────────────────────────── */}
        <div className="reveal mt-14 md:mt-20 grid grid-cols-2 gap-8 md:gap-16 max-w-[560px] mx-auto">
          <MetaBadge
            icon={<PinIcon />}
            label={dict.locationLabel}
            value={locationValue}
          />
          <MetaBadge
            icon={<CalendarIcon />}
            label={dict.dateLabel}
            value={dateValue.toUpperCase()}
          />
        </div>

        {/* ── Hairline separator ─────────────────────────────────── */}
        <div
          aria-hidden
          className="reveal mx-auto mt-14 md:mt-20 h-px bg-ivory/15"
          style={{ width: '100%' }}
        />

        {/* ── Form title ─────────────────────────────────────────── */}
        <h2
          className="reveal mt-16 md:mt-24 font-display italic text-ivory"
          style={{
            fontSize: 'clamp(36px, 5.4vw, 88px)',
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          {dict.formTitle}
        </h2>
        <p className="reveal mt-5 md:mt-7 mx-auto max-w-[52ch] font-nav font-light text-ivory/80 text-[14px] md:text-[15px] leading-[1.8]">
          {dict.formIntro}
        </p>

        {/* ── Form or success card ───────────────────────────────── */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="reveal mt-12 md:mt-16 text-left flex flex-col gap-8"
            noValidate={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className={LABEL_CLASSES} htmlFor="reg-name">
                  {dict.nameLabel}
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                  autoComplete="given-name"
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <label className={LABEL_CLASSES} htmlFor="reg-surname">
                  {dict.surnameLabel}
                </label>
                <input
                  id="reg-surname"
                  type="text"
                  value={form.surname}
                  onChange={handleChange('surname')}
                  required
                  autoComplete="family-name"
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLASSES} htmlFor="reg-phone">
                {dict.phoneLabel}
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                required
                autoComplete="tel"
                inputMode="tel"
                className={INPUT_CLASSES}
              />
            </div>

            {/* Privacy consent */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <span
                className={[
                  'relative mt-0.5 h-5 w-5 shrink-0 border transition-colors',
                  'flex items-center justify-center',
                  form.consent
                    ? 'border-amber bg-amber'
                    : 'border-ivory/40 bg-transparent',
                ].join(' ')}
              >
                {form.consent && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="#1a1410"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={handleChange('consent')}
                required
                className="sr-only"
              />
              <span className="font-nav text-[13px] leading-[1.6] text-ivory/80">
                {dict.consent}
              </span>
            </label>

            {submitError && (
              <p className="self-center font-nav text-amber/90 text-[13px]">
                {submitError}
              </p>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="group relative inline-flex items-center justify-center self-center mt-4 overflow-hidden rounded-full bg-amber text-charcoal hover:bg-amber-deep transition-all duration-500 hover:-translate-y-0.5 px-12 py-5 font-nav font-semibold uppercase disabled:opacity-60 disabled:cursor-progress disabled:hover:translate-y-0"
              style={{ fontSize: '12px' }}
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">
                {submitting ? '…' : dict.submit}
              </span>
            </button>
          </form>
        ) : (
          <div className="reveal mt-12 md:mt-16 mx-auto max-w-[520px] rounded-[14px] border border-ivory/15 bg-ivory/[0.04] backdrop-blur-sm p-8 md:p-10 text-center">
            <h3
              className="font-display italic text-ivory"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500 }}
            >
              {dict.successTitle}
            </h3>
            <p className="mt-4 font-nav text-ivory/80 text-[14px] leading-[1.7]">
              {dict.successBody}
            </p>
            <Link
              href="/workshops"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-ivory/30 px-7 py-3 font-nav font-semibold uppercase text-ivory hover:bg-ivory hover:text-charcoal transition-colors"
              style={{ fontSize: '11px'}}
            >
              <span>{dict.backToCalendar}</span>
              <span aria-hidden>↗︎</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
