'use client';
import Image from 'next/image';
import { FOOTER_LINKS } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';
import { useGsapReveal } from '@/hooks/useGsapReveal';

export default function Footer({ locale = 'tr' }) {
  const dict = getDictionary(locale).footer;
  const ref = useGsapReveal();

  return (
    <footer ref={ref} className="bg-[#0b0806] text-ivory">
      <div className="max-w-[1440px] mx-auto px-7 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10">
          <div className="reveal">
            <Image
              src="/images/logo_white.png"
              alt="Shining Brows"
              width={3375}
              height={4219}
              className="h-[110px] md:h-[130px] w-auto object-contain"
            />
          </div>

          <FooterColumn
            title={dict.sections.egitimler}
            items={FOOTER_LINKS.egitimler}
          />
          <FooterColumn
            title={dict.sections.akademi}
            items={FOOTER_LINKS.akademi}
          />

          <div className="reveal">
            <h4 className="text-[10px] uppercase text-zinc-200 font-nav">
              {dict.sections.iletisim}
            </h4>
            <ul className="mt-6 space-y-3 font-nav">
              {FOOTER_LINKS.iletisim.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-[13px] font-light text-ivory hover:text-zinc-300 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-6 flex items-center justify-between text-[10px] tracking-[0.16em] border-t-[0.5px] border-white/[0.08] font-nav" style={{ color: '#a89888' }}>
          <div>{dict.rights}</div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div className="reveal">
      <h4 className="text-[10px] uppercase text-zinc-200 font-nav">
        {title}
      </h4>
      <ul className="mt-6 space-y-3 font-nav">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="text-[13px] font-light text-ivory hover:text-zinc-300 transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
