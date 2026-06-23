# Shining Brows Academy

Premium warm-editorial landing page for a Turkish brow workshop brand with trainers in Türkiye, KKTC, and the Netherlands. Built with Next.js 14 (App Router), Tailwind CSS v3, GSAP + ScrollTrigger, and Lenis.

## Install

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## File structure

```
shining-brows/
├── next.config.js
├── tailwind.config.js          brand tokens (colors, fonts, sizes)
├── postcss.config.js
├── jsconfig.json               @/* path alias → src/*
├── public/
│   ├── images/
│   │   ├── hero-before.jpg     replace with real brow portrait
│   │   └── hero-after.jpg      replace with real brow portrait
│   └── videos/                 hybrid-remover.mp4 (drop in later)
└── src/
    ├── app/
    │   ├── layout.js           wraps everything in LenisProvider + grain overlay
    │   ├── page.js             Nav + Hero + Footer + placeholder for sections
    │   ├── globals.css         tailwind directives + grain + accent bar
    │   └── fonts.js            Cormorant Garamond + Plus Jakarta Sans
    ├── components/
    │   ├── Nav.js              fixed nav, scroll state-change, lang toggle
    │   ├── Hero.js             scroll-driven before/after reveal
    │   ├── Footer.js           three-column footer
    │   └── LenisProvider.js    initialises Lenis + wires to GSAP ticker
    ├── hooks/
    │   ├── useLenis.js         standalone Lenis hook (alternative to provider)
    │   └── useGsapReveal.js    ref-based scroll reveal for `.reveal` elements
    └── lib/
        ├── constants.js        brand info, nav + footer links
        └── i18n/
            ├── tr.js           Turkish copy
            ├── en.js           English copy
            └── index.js        getDictionary(locale)
```

## HERO_CONFIG values

Located at the top of `src/components/Hero.js`. All animation behavior is driven from this object:

| Key | Meaning |
| --- | --- |
| `revealEasing` | GSAP easing for programmatic reveal transitions |
| `revealDuration` | seconds for the auto-demo reveal |
| `autoPlayDelay` | ms after mount before auto-demo starts |
| `autoPlayTarget` | % to reveal during auto-demo (stops midway to invite scroll) |
| `autoPlayStep` | % per frame during auto-demo |
| `autoPlayInterval` | ms per auto-demo frame (~70fps feel at 14ms) |
| `scrollPin` | pin the hero during the scroll-driven reveal |
| `scrollScrub` | ScrollTrigger scrub smoothness (higher = lazier) |
| `scrollStart` | ScrollTrigger `start` value |
| `scrollEnd` | how far you must scroll to complete the reveal |
| `entranceStagger` | seconds between headline word reveals |
| `entranceDelay` | seconds before entrance sequence begins |

The auto-demo cancels on the first `wheel`, `touchstart`, or `scroll` event.

## Replacing the hero images

1. Drop two images into `public/images/`:
   - `hero-before.jpg` — brow portrait before treatment
   - `hero-after.jpg` — brow portrait after treatment
2. Both should be tall vertical crops (around 4:5 or 3:4) so the `object-cover` `object-[center_top]` rule keeps the brows visible across viewport sizes.
3. Both images are `priority` (next/image LCP candidates) — keep file sizes reasonable (< 400KB each).

## Adding page sections

Sections drop into `src/app/page.js` between the `Hero` and the `Footer`, at the comment placeholder:

```jsx
<main>
  <Hero locale={locale} />
  {/* page sections go here */}
  <Manifesto />
  <Courses />
  ...
</main>
```

For scroll reveals, wrap a section in `useGsapReveal()` and add `className="reveal"` to any child that should animate in:

```jsx
import { useGsapReveal } from '@/hooks/useGsapReveal';

export default function Manifesto() {
  const ref = useGsapReveal();
  return (
    <section ref={ref} className="bg-ivory-soft px-7 md:px-10 py-32">
      <p className="reveal text-label text-amber-deep">Manifesto</p>
      <h2 className="reveal mt-6 font-display text-section">...</h2>
    </section>
  );
}
```

Never add `reveal` to the hero — the hero has its own mount-driven entrance animation.

## i18n

User-facing copy lives in `src/lib/i18n/tr.js` and `en.js`. Default locale is Turkish.

- The Nav language toggle calls `onLocaleChange` from `page.js` and updates a local state.
- Nav, Hero, and Footer all receive a `locale` prop and pull copy via `getDictionary(locale)`.
- To add a third locale: create `src/lib/i18n/xx.js`, register it in `src/lib/i18n/index.js`, and add it to `LOCALES`.

Path-based i18n (`/tr/...`, `/en/...`) is not wired up — switching is in-page only for now.

## Performance

- LCP candidates (hero images): `priority`. All other images should be `loading="lazy"`.
- GSAP + ScrollTrigger: dynamic-imported inside `useEffect` only.
- Lenis: client-side only, single instance via `LenisProvider`.
- Fonts: subsets include `latin-ext` (Turkish characters).
- Targets: LCP < 2.5s, CLS < 0.1, FID < 100ms.

## Brand tokens

All colors, font families, and font sizes are defined in `tailwind.config.js` under `theme.extend`. Reference them with Tailwind classes (`bg-ivory`, `text-amber`, `font-display`, `text-hero`) — never hardcode hex values inside components.
# shining-brows-website
