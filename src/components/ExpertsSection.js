'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

const APP_STORE_URL =
  'https://apps.apple.com/tr/app/shining-brows-expert-portal/id6758101995';

function MapVisual() {
  return (
    <div className="relative flex h-full min-h-[300px] items-center justify-center overflow-hidden bg-[#050505]">
      <div className="relative h-[230px] w-[230px] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] md:h-[310px] md:w-[310px]">
        <Image
          src="/images/worldmap.png"
          alt=""
          fill
          aria-hidden
          sizes="(min-width: 1024px) 310px, 230px"
          className="object-contain opacity-95"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
    </div>
  );
}

function AppVisual() {
  return (
    <div className="relative flex h-full min-h-[300px] items-center justify-center overflow-hidden bg-[#050505] px-8">
      <Image
        src="/images/logo_white_with_text.png"
        alt=""
        width={760}
        height={340}
        aria-hidden
        className="h-auto w-[62%] object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
      />
    </div>
  );
}

function ExpertCard({ item, visual }) {
  const Wrapper = item.external ? 'a' : Link;
  const wrapperProps = item.external
    ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
    : { href: item.href };

  return (
    <Wrapper
      {...wrapperProps}
      className="reveal group block overflow-hidden bg-[#2b2b2d] text-ivory transition-transform duration-700 hover:-translate-y-2"
    >
      <div className="aspect-[1.18] overflow-hidden">
        <div className="h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
          {visual}
        </div>
      </div>
      <div className="px-8 py-9 md:px-12 md:py-12">
        <h3
          className="font-display italic"
          style={{
            fontSize: 'clamp(42px, 4vw, 76px)',
            lineHeight: 0.96,
            fontWeight: 400,
          }}
        >
          {item.title}
        </h3>
        <p
          className="mt-7 max-w-[28ch] font-nav font-light text-ivory/82"
          style={{ fontSize: 'clamp(16px, 1.18vw, 22px)', lineHeight: 1.75 }}
        >
          {item.body}
        </p>
        <span className="mt-10 inline-flex">
          <span className="relative inline-flex overflow-hidden rounded-full border border-white/20 bg-white px-7 py-4 font-nav text-[12px] font-medium text-charcoal transition-all duration-500 group-hover:-translate-y-1 group-hover:border-white/40 group-hover:text-black md:px-10 md:py-5 md:text-[13px]">
            <span className="relative">{item.cta}</span>
          </span>
        </span>
      </div>
    </Wrapper>
  );
}

export default function ExpertsSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).experts;
  const ref = useGsapReveal();

  const cards = [
    { ...dict.map, href: '/experts' },
    { ...dict.app, href: APP_STORE_URL, external: true },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black py-28 text-ivory md:py-40"
      aria-label={dict.ariaLabel}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <div className="mx-auto max-w-[1600px] px-7 md:px-10">
        <div className="reveal max-w-[980px]">
          <h2
            className="font-logo text-ivory"
            style={{
              fontSize: 'clamp(64px, 10vw, 178px)',
              lineHeight: 0.9,
              fontWeight: 500,
            }}
          >
            {dict.headline}
          </h2>
          <div
            className="mt-4 flex items-baseline gap-4 font-logo italic text-ivory md:mt-6 md:gap-7"
            style={{
              fontSize: 'clamp(44px, 7.8vw, 132px)',
              lineHeight: 0.95,
              fontWeight: 500,
            }}
          >
            <span
              aria-hidden
              className="inline-block"
              style={{
                height: 1,
                width: 'clamp(42px, 6vw, 118px)',
                background: '#faf7f2',
                transform: 'translateY(-0.6em)',
                flex: '0 0 auto',
              }}
            />
            <span>{dict.subline}</span>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:mt-28 lg:grid-cols-2 lg:gap-8">
          <ExpertCard item={cards[0]} visual={<MapVisual />} />
          <ExpertCard item={cards[1]} visual={<AppVisual />} />
        </div>
      </div>
    </section>
  );
}
