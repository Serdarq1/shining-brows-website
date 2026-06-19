'use client';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * OperationTemplateHero — shared template for the /courses/[slug] pages.
 *
 *   • Renders a main "operation hero" panel at the top: image on the left,
 *     italic Freight title + descriptive paragraph on the right.
 *   • Below it, the operation's `sections` array drives a series of
 *     alternating image/text panels — image-left/text-right, then
 *     image-right/text-left, etc.
 *   • Ivory (#F7F4EE) background throughout the section so the operation
 *     page reads as the warm "documentation" counterpart to the dark
 *     editorial flow of /courses.
 *
 * Data shape (see `operations[slug]` in the i18n dictionaries):
 *   {
 *     name, subtitle, heroImage, heroBody,
 *     sections: [{ title, body, image, side: 'left' | 'right' }, …]
 *   }
 * ------------------------------------------------------------------------- */

function ProductFacts({ ingredients, labels }) {
  if (!ingredients?.length) return null;

  return (
    <div className="reveal mt-8 grid grid-cols-1 gap-6 font-nav">
      <div>
        <span className="block text-charcoal/55 text-[12px] font-semibold">
          {labels.ingredients}
        </span>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {ingredients.map((item, i) => (
            <li
              key={i}
              className="flex items-baseline text-charcoal/80 text-[13px]"
            >
              <span aria-hidden className="mr-2 text-charcoal/45">»</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Block({ title, body, image, imageOnRight, ingredients, labels }) {
  return (
    <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
      {imageOnRight ? (
        <>
          <div className="md:col-span-6 order-2 md:order-1">
            <h2
              className="reveal font-display italic text-charcoal"
              style={{
                fontSize: 'clamp(28px, 3.6vw, 60px)',
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {title}
            </h2>
            <p
              className="reveal mt-6 md:mt-8 max-w-[48ch] font-nav font-light text-charcoal/82"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
            >
              {body}
            </p>
            <ProductFacts ingredients={ingredients} labels={labels} />
          </div>
          <div className="reveal md:col-span-6 order-1 md:order-2 relative w-full aspect-[4/5]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover object-center"
            />
          </div>
        </>
      ) : (
        <>
          <div className="reveal md:col-span-6 relative w-full aspect-[4/5]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover object-center"
            />
          </div>
          <div className="md:col-span-6">
            <h2
              className="reveal font-display italic text-charcoal"
              style={{
                fontSize: 'clamp(28px, 3.6vw, 60px)',
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {title}
            </h2>
            <p
              className="reveal mt-6 md:mt-8 max-w-[48ch] font-nav font-light text-charcoal/82"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
            >
              {body}
            </p>
            <ProductFacts ingredients={ingredients} labels={labels} />
          </div>
        </>
      )}
    </div>
  );
}

export default function OperationTemplateHero({ locale = 'tr', slug }) {
  const dict = getDictionary(locale).operations?.[slug];
  const labels = getDictionary(locale).productDetails;
  const ref = useGsapReveal();
  if (!dict) return null;

  return (
    <section
      ref={ref}
      className="relative text-charcoal pt-32 md:pt-40 pb-28 md:pb-36 overflow-hidden"
      style={{ backgroundColor: '#F7F4EE' }}
      aria-label={dict.name}
    >
      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
        {/* ── Main hero — image left, title + body right ─────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="reveal md:col-span-6 relative w-full aspect-[4/5]">
            <Image
              src={dict.heroImage}
              alt={dict.name}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="md:col-span-6">
            <h1
              className="reveal font-display text-charcoal"
              style={{
                fontSize: 'clamp(40px, 5.6vw, 96px)',
                lineHeight: 1.0,
                fontWeight: 400,
              }}
            >
              {dict.name}
            </h1>
            <p
              className="reveal mt-1 md:mt-2 font-display italic text-charcoal"
              style={{
                fontSize: 'clamp(24px, 3.4vw, 56px)',
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              — {dict.subtitle}
            </p>
            <p
              className="reveal mt-8 md:mt-10 max-w-[48ch] font-nav font-light text-charcoal/82"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
            >
              {dict.heroBody}
            </p>
          </div>
        </div>

        {/* ── Alternating image/text blocks ─────────────────────── */}
        {dict.sections?.map((s, i) => (
          <Block
            key={i}
            title={s.title}
            body={s.body}
            image={s.image}
            imageOnRight={s.side === 'right'}
            ingredients={s.ingredients}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}
