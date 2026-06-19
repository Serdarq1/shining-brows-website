'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';
import { RANK_LOGOS } from '@/lib/workshops';

/* ---------------------------------------------------------------------------
 * FindCourseSection — the "Find a Course" page core.
 *
 * Layout
 *   • Ivory background — matches the other editorial pages.
 *   • Stacked freight headline: roman "Workshop" + italic "Calendar".
 *   • A filter bar (three native <select>s — Location, Format, Month).
 *   • A responsive grid of workshop cards. Each card has:
 *       - circular master portrait intersecting the top border
 *       - master name in italic Freight
 *       - "SHINING BROWS" hairline-flanked band spanning border-to-border
 *       - master status (Founder, Gold Master, Master Trainer, …)
 *       - workshop format (Online / Face-to-face)
 *       - month
 *       - location (only when face-to-face)
 *       - amber CTA pill at the bottom, matching the promo-bar amber.
 *
 * Mock data lives in WORKSHOPS below — swap to a CMS or API later.
 * ------------------------------------------------------------------------- */

// Compact <select> styling shared across all three filters.
const SELECT_CLASSES = [
  'appearance-none w-full bg-transparent border border-ivory/30',
  'rounded-full px-5 py-3 pr-10 text-ivory font-nav text-[12px]',
  'uppercase tracking-[0.22em] font-semibold',
  'focus:outline-none focus:border-ivory/70 hover:border-ivory/50',
  'transition-colors cursor-pointer',
].join(' ');

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="relative block">
      <span className="block mb-2 font-nav text-[10px] font-semibold text-ivory/60">
        {label}
      </span>
      <div className="relative">
        <select
          className={SELECT_CLASSES}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-charcoal">
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ivory/60 text-xs"
        >
          ▾
        </span>
      </div>
    </label>
  );
}

function WorkshopCard({ workshop, dict }) {
  const { master, type, location, monthIndex, year, href } = workshop;
  const monthLabel = `${dict.monthNames[monthIndex]} ${year}`;
  const statusLabel = dict.statuses[master.status] || master.status;
  const rightLabel =
    type === 'face-to-face' && location ? location : dict.filters.online;

  return (
    <article
      className={[
        'reveal relative bg-white',
        'rounded-[14px]',
        'flex flex-col items-center text-center',
        'min-h-[520px] md:min-h-[580px]',
        'shadow-[0_30px_70px_rgba(26,20,16,0.13)]',
      ].join(' ')}
    >
      {/* ── Profile portrait — sits above the card edge ─────────── */}
      <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-[6px] ring-[#F7F4EE] shadow-[0_12px_36px_rgba(26,20,16,0.18)] bg-neutral-100 z-10">
        <Image
          src={master.photo}
          alt={master.name}
          fill
          sizes="120px"
          className="object-cover object-center"
        />
      </div>

      {/* ── Name ────────────────────────────────────────────────── */}
      <div className="pt-16 md:pt-20 px-6 w-full">
        <h3
          className="font-display italic text-charcoal"
          style={{
            fontSize: 'clamp(22px, 2vw, 30px)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {master.name}
        </h3>
      </div>

      {/* ── "shining brows" — italic Freight, single line, oversized so
            the leading `s` of "shining" and the trailing `s` of "brows"
            run past the card's left and right edges. The wrapper has
            `overflow-hidden` so the bleed is clipped exactly at the
            card border — visually the two `s` letters look like they
            are tucked behind the card's edges. */}
      <div className="w-full mt-4 md:mt-6 overflow-hidden">
        <p
          className="font-display italic text-charcoal/35 whitespace-nowrap text-center leading-none"
          style={{
            fontSize: 'clamp(52px, 6.4vw, 84px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            marginLeft: '-0.18em',
            marginRight: '-0.18em',
          }}
        >
          shining brows
        </p>
      </div>

      {/* ── Rank logo + status ─────────────────────────────────── */}
      <div className="flex-1 w-full px-6 py-6 flex flex-col items-center justify-center gap-3">
        {RANK_LOGOS[master.status] && (
          <div className="relative h-12 w-12 md:h-14 md:w-14">
            <Image
              src={RANK_LOGOS[master.status]}
              alt=""
              fill
              sizes="64px"
              className="object-contain object-center"
            />
          </div>
        )}
        <p
          className="font-nav uppercase text-charcoal"
          style={{ fontSize: '11px', letterSpacing: '0.26em', fontWeight: 600 }}
        >
          {statusLabel}
        </p>
      </div>

      {/* ── Date (left) + Location (right) — just above CTA ────── */}
      <div className="w-full px-6 pb-5 flex items-baseline justify-between gap-3">
        <p
          className="font-display italic text-charcoal"
          style={{ fontSize: '18px', lineHeight: 1 }}
        >
          {monthLabel}
        </p>
        <p
          className="font-nav uppercase text-charcoal/80"
          style={{ fontSize: '11px', letterSpacing: '0.22em', fontWeight: 600 }}
        >
          {rightLabel}
        </p>
      </div>

      {/* ── Full-width amber CTA — bleeds border-l → border-r ─── */}
      <Link
        href={href}
        className="block w-full bg-amber text-charcoal hover:bg-amber-deep transition-colors text-center font-nav font-semibold uppercase py-5 md:py-6 rounded-b-[14px]"
        style={{ fontSize: '12px', letterSpacing: '0.26em' }}
      >
        {dict.joinNow}
      </Link>
    </article>
  );
}

export default function FindCourseSection({ locale = 'tr', workshops = [] }) {
  const dict = getDictionary(locale).findCourse;
  const ref = useGsapReveal();

  const [filterLocation, setFilterLocation] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');

  // Locations available in the data, deduplicated. The label is just
  // the city string straight from the workshop (already Turkish-cased
  // in the DB).
  const locationOptions = useMemo(() => {
    const seen = new Set();
    const list = [];
    workshops.forEach((w) => {
      if (w.locationKey && !seen.has(w.locationKey)) {
        seen.add(w.locationKey);
        list.push({ value: w.locationKey, label: w.location });
      }
    });
    return [{ value: 'all', label: dict.filters.allLocations }, ...list];
  }, [dict, workshops]);

  const typeOptions = [
    { value: 'all', label: dict.filters.allTypes },
    { value: 'online', label: dict.filters.online },
    { value: 'face-to-face', label: dict.filters.faceToFace },
  ];

  const monthOptions = useMemo(() => {
    const seen = new Set();
    const list = [];
    workshops.forEach((w) => {
      const key = `${w.year}-${w.monthIndex}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          value: key,
          label: `${dict.monthNames[w.monthIndex]} ${w.year}`,
          year: w.year,
          monthIndex: w.monthIndex,
        });
      }
    });
    list.sort((a, b) =>
      a.year === b.year ? a.monthIndex - b.monthIndex : a.year - b.year
    );
    return [{ value: 'all', label: dict.filters.allMonths }, ...list];
  }, [dict, workshops]);

  const filtered = workshops.filter((w) => {
    if (filterLocation !== 'all' && w.locationKey !== filterLocation) {
      // Online courses have no locationKey — exclude them when a specific
      // city is selected.
      return false;
    }
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (filterMonth !== 'all') {
      const key = `${w.year}-${w.monthIndex}`;
      if (key !== filterMonth) return false;
    }
    return true;
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      aria-label={dict.ariaLabel}
    >
      {/* ═══════════ DARK BAND — header + filters ═══════════ */}
      <div className="relative bg-black text-ivory pt-28 md:pt-36 pb-20 md:pb-28">
        {/* Soft top hairline so it reads as continuous from the section above */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
          {/* ── Editorial header ───────────────────────────────────── */}
          <div className="max-w-[900px]">
          <span className="reveal block font-nav uppercase text-ivory/70 text-[11px] font-semibold">
            {dict.eyebrow}
          </span>
          <h1
            className="reveal mt-5 md:mt-7 font-logo text-ivory uppercase"
            style={{
              fontSize: 'clamp(54px, 10vw, 168px)',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            {dict.title}
          </h1>
          <div
            className="reveal font-logo italic text-ivory mt-2 md:mt-3 flex items-baseline gap-3 md:gap-6"
            style={{
              fontSize: 'clamp(40px, 8vw, 140px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            <span
              aria-hidden
              className="inline-block"
              style={{
                height: 1,
                width: 'clamp(24px, 6vw, 110px)',
                background: '#faf7f2',
                transform: 'translateY(-0.6em)',
                flex: '0 0 auto',
              }}
            />
            <span>{dict.subtitle}</span>
          </div>
          <p className="reveal mt-8 md:mt-10 max-w-[60ch] font-nav font-light text-ivory/80 text-[15px] md:text-[16px] leading-[1.85]">
            {dict.intro}
          </p>
        </div>

          {/* ── Filters ─────────────────────────────────────────────── */}
          <div className="reveal mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 max-w-[900px]">
            <FilterSelect
              label={dict.filters.location}
              value={filterLocation}
              onChange={setFilterLocation}
              options={locationOptions}
            />
            <FilterSelect
              label={dict.filters.type}
              value={filterType}
              onChange={setFilterType}
              options={typeOptions}
            />
            <FilterSelect
              label={dict.filters.date}
              value={filterMonth}
              onChange={setFilterMonth}
              options={monthOptions}
            />
          </div>
        </div>
      </div>

      {/* ═══════════ IVORY BAND — workshop cards ═══════════ */}
      <div
        className="relative text-charcoal pt-28 md:pt-36 pb-28 md:pb-36"
        style={{ backgroundColor: '#F7F4EE' }}
      >
        <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-20 md:gap-y-24">
              {filtered.map((w) => (
                <WorkshopCard key={w.id} workshop={w} dict={dict} />
              ))}
            </div>
          ) : (
            <p className="reveal text-center font-nav text-charcoal/70 text-[14px] py-16">
              {dict.noResults}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
