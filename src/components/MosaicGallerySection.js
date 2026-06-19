'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

/* ---------------------------------------------------------------------------
 * MosaicGallerySection — scroll-pinned editorial gallery.
 *
 * Behaviour the user asked for:
 *   • when the section reaches the top of the viewport, the page STOPS
 *     advancing — the section is pinned.
 *   • scrolling now only drives the animation: the full-bleed `6.png`
 *     shrinks toward the centre while a constellation of supporting
 *     images fades into place around it.
 *   • once the animation finishes, scroll resumes and the page moves on.
 *
 * Implementation uses GSAP ScrollTrigger's `pin: true` rather than CSS
 * `position: sticky` because the latter is brittle when ancestors set
 * overflow rules and is easy for smooth-scroll libraries to break.
 * ScrollTrigger inserts a spacer the size of `end` and locks the trigger
 * in place — that's exactly the "scroll captured by the animation"
 * feel the user described.
 * ------------------------------------------------------------------------- */

const SCATTERED = [
  // top band
  { src: '/images/1.png',  top: '5%',  left: '4%',  w: 'clamp(150px, 19vw, 340px)', rot: -7,  fromX: -120, fromY: -40,  depth: 1 },
  { src: '/images/7.png',  top: '2%',  left: '40%', w: 'clamp(110px, 13vw, 220px)', rot:  2,  fromX:    0, fromY: -120, depth: 2 },
  { src: '/images/3.png',  top: '7%',  left: '74%', w: 'clamp(130px, 16vw, 280px)', rot:  5,  fromX:  120, fromY: -40,  depth: 1 },

  // middle band — kept off the centerpiece's vertical axis
  { src: '/images/11.png', top: '34%', left: '1%',  w: 'clamp(110px, 13vw, 230px)', rot: -10, fromX: -160, fromY:   0,  depth: 1 },
  { src: '/images/9.png',  top: '32%', left: '83%', w: 'clamp(120px, 14vw, 250px)', rot:   7, fromX:  160, fromY:   0,  depth: 2 },

  // bottom band
  { src: '/images/4.png',  top: '62%', left: '5%',  w: 'clamp(140px, 17vw, 300px)', rot: -3,  fromX: -100, fromY:  60,  depth: 1 },
  { src: '/images/8.png',  top: '74%', left: '44%', w: 'clamp(120px, 14vw, 250px)', rot: -5,  fromX:    0, fromY: 120,  depth: 2 },
  { src: '/images/5.png',  top: '64%', left: '75%', w: 'clamp(140px, 16vw, 290px)', rot:  4,  fromX:  100, fromY:  60,  depth: 1 },
];

// How many viewport heights of scroll the pin should consume. Bigger =
// slower, more deliberate animation. The page resumes after this much
// scroll inside the pin.
const PIN_SCROLL_LENGTH = '220%';

export default function MosaicGallerySection({ locale = 'tr' }) { // eslint-disable-line no-unused-vars
  const sectionRef = useRef(null);
  const centerpieceRef = useRef(null);
  const itemsRef = useRef([]);
  itemsRef.current = [];
  const addItemRef = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
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
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set(centerpieceRef.current, { scale: 0.32 });
          itemsRef.current.forEach((el, i) => {
            const meta = SCATTERED[i];
            gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, rotation: meta.rot });
          });
          return;
        }

        gsap.set(centerpieceRef.current, {
          scale: 1,
          transformOrigin: 'center center',
        });
        itemsRef.current.forEach((el, i) => {
          const meta = SCATTERED[i];
          gsap.set(el, {
            opacity: 0,
            x: meta.fromX,
            y: meta.fromY,
            scale: 0.78,
            rotation: meta.rot * 0.3,
            transformOrigin: 'center center',
          });
        });

        // ── Pinned, scrubbed timeline.
        // Pin: section freezes at top of viewport for PIN_SCROLL_LENGTH
        // of scroll. Scrub: every bit of that scroll drives the timeline.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${PIN_SCROLL_LENGTH}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 (0 → 0.6 of timeline): centerpiece shrinks gently
        tl.to(
          centerpieceRef.current,
          { scale: 0.32, ease: 'power2.inOut', duration: 0.6 },
          0
        );

        // Slight dim on the centerpiece once it's small so the scattered
        // tiles read clearly against it.
        tl.to(
          centerpieceRef.current,
          { filter: 'brightness(0.6)', duration: 0.4 },
          0.35
        );

        // Phase 2 (0.25 → 1.0): scattered tiles enter, staggered
        itemsRef.current.forEach((el, i) => {
          const meta = SCATTERED[i];
          tl.to(
            el,
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: meta.rot,
              ease: 'power3.out',
              duration: 0.55,
            },
            0.25 + i * 0.07
          );
        });
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black h-screen w-full overflow-hidden"
      aria-label="Editorial gallery"
    >
      {/* ── Centerpiece — opens full-bleed, scales down on scroll ── */}
      <div
        ref={centerpieceRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/6.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Faint inner vignette so the edges drop into the surrounding black */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
          }}
        />
      </div>

      {/* ── Scattered constellation ─────────────────────────────────── */}
      {SCATTERED.map((item, i) => (
        <div
          key={i}
          ref={addItemRef}
          className="absolute will-change-transform pointer-events-none"
          style={{
            top: item.top,
            left: item.left,
            width: item.w,
            zIndex: item.depth + 1,
          }}
        >
          <div
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px]"
            style={{
              boxShadow:
                '0 30px 80px rgba(0,0,0,0.55), 0 12px 28px rgba(0,0,0,0.45)',
            }}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      ))}

      {/* Hairline to bridge into the next section visually */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)',
        }}
      />
    </section>
  );
}
