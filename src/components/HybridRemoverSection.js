'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * Hybrid Remover — cinematic 6-scene scroll sequence
 *
 * Background stays warm ivory throughout. No dark wash, no atmospheric overlay.
 *
 * Progress map (single scrub timeline, pinned 600vh):
 *   0.00–0.18  Scene 01: "Sektörde bir ilk olan"
 *   0.20–0.36  Scene 02: "Hybrid Remover ile tanışın"
 *   0.38–0.54  Scene 03: centred bottle + floating product tags
 *              Each tag floats independently up/down — continuous.
 *   0.55–0.70  Scene 04: bottle drifts diagonally down-left;
 *              closed box rises from below into the lower-left quadrant.
 *   0.70–0.86  Scene 05: bottle settles BESIDE the box (not into it);
 *              spinning logo fades in on the right.
 *   0.86–1.00  Scene 06: interactive ingredient dots become clickable;
 *              micro-copy fades in.
 *
 * Navbar is auto-hidden while inside the narrative (progress 0.02–0.90),
 * brought back at the dock moment so the final composition has UI again.
 * ------------------------------------------------------------------------- */

const PALETTE = {
  ivory: '#F7F4EE',
  ink: '#111111',
  inkSoft: '#222222',
};

const FLOATING_TAG_LAYOUT = [
  { top: '11%', left: '8%', duration: 4.6, delay: 0.2, amplitude: 13 },
  { top: '14%', right: '10%', duration: 5.4, delay: 1.1, amplitude: 11 },
  { top: '28%', left: '20%', duration: 4.9, delay: 0.5, amplitude: 9 },
  { top: '31%', right: '22%', duration: 5.8, delay: 1.8, amplitude: 14 },
  { top: '48%', left: '7%', duration: 5.1, delay: 1.4, amplitude: 12 },
  { top: '50%', right: '8%', duration: 4.7, delay: 0.7, amplitude: 10 },
  { bottom: '23%', left: '16%', duration: 5.6, delay: 2.2, amplitude: 15 },
  { bottom: '19%', right: '18%', duration: 4.8, delay: 2.8, amplitude: 9 },
  { bottom: '9%', left: '42%', duration: 6.2, delay: 1.6, amplitude: 12, className: 'hidden sm:block' },
];

/* ── Floating ingredient tag (Scene 3) ──────────────────────────────────
   Each tag mounts with its own infinite yoyo timeline so they bob up and
   down independently, with different durations + delays so the set never
   syncs into a "the whole group is moving" feel.
   ─────────────────────────────────────────────────────────────────────── */
function FloatTag({ style, className = '', label, duration = 3.4, delay = 0, amplitude = 9 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    let tl;
    (async () => {
      const gsap = (await import('gsap')).default;
      if (cancelled) return;
      tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: 'sine.inOut', duration },
        delay,
      });
      tl.to(ref.current, { y: -amplitude });
    })();
    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, [duration, delay, amplitude]);

  return (
    <div ref={ref} className={`absolute pointer-events-none ${className}`} style={style}>
      <div
        className="whitespace-nowrap rounded-full px-3.5 py-2 font-nav text-[#1a1410] sm:px-4"
        style={{
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(14px) saturate(120%)',
          WebkitBackdropFilter: 'blur(14px) saturate(120%)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: 'inset 0 0 12px rgba(255,255,255,0.18)',
          fontSize: 'clamp(11px, 0.95vw, 13px)',
          letterSpacing: '0.02em',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Spinning logo on the right (Scene 6) ───────────────────────────────
   Same circular-text orbit treatment as the About section, but on ivory
   with the BLACK logo. Logo is static; the SVG text rotates around it.
   ─────────────────────────────────────────────────────────────────────── */
function SpinningLogoBlack({ label }) {
  const text = label.repeat(3);
  return (
    <div
      className="relative"
      style={{
        width: 'clamp(160px, 13vw, 220px)',
        height: 'clamp(160px, 13vw, 220px)',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow w-full h-full"
        aria-hidden
      >
        <defs>
          <path
            id="hybrid-spin-path"
            d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
            fill="none"
          />
        </defs>
        <text
          fill={PALETTE.ink}
          style={{
            fontFamily: 'var(--font-jost)',
            fontSize: 12,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <textPath href="#hybrid-spin-path" startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <Image
        src="/images/logo_black.png"
        alt=""
        width={220}
        height={80}
        className="absolute inset-0 m-auto w-[56%] h-auto object-contain pointer-events-none"
      />
    </div>
  );
}

/* ── Interactive ingredient dot (Scene 6) ───────────────────────────────
   Closed: just the dot. Clicked: a thin horizontal line slides out to the
   right and the ingredient label fades in beside it. Click again to retract.
   ─────────────────────────────────────────────────────────────────────── */
/* ── IngredientDot ──────────────────────────────────────────────────────
   Anchored as a zero-size container at the desired (x, y) coordinate.
   The dot sits at (0, 0) of that anchor and never moves — when expanded
   only the SVG path + label fade/draw in beside it.

   The path varies per dot index so the four callouts fan out like the
   reference: top dots angle UPWARD at the start, bottom dots angle
   DOWNWARD at the end, the closer-to-centre dots are nearly straight.
   ────────────────────────────────────────────────────────────────────── */
function IngredientDot({
  index,
  totalDots,
  position,
  label,
  expanded,
  interactive,
  onToggle,
}) {
  // Geometry of the callout — short rightward callout from the dot in the
  // left empty space, ending well before the bottle.
  const lineWidth = 100;
  const lineHeight = 70;
  const centerY = lineHeight / 2;
  const startBreakX = 38;
  const endBreakX = lineWidth - 38;

  // The vertical "fan" amount — bigger for the outermost dots, smaller
  // for the ones closer to the middle.
  const half = Math.floor(totalDots / 2);
  const isTop = index < half;
  const distanceFromCentre = isTop ? half - index : index - half + 1;
  const fanStep = 10; // px per rank
  const baseRise = 6;
  const rise = baseRise + (distanceFromCentre - 1) * fanStep;

  let pathD;
  let labelY;
  if (isTop) {
    // Angle at the START: goes up, then horizontal right.
    const top = centerY - rise;
    pathD = `M 0 ${centerY} L ${startBreakX} ${top} L ${lineWidth} ${top}`;
    labelY = top;
  } else {
    // Horizontal first, then angles DOWN at the end.
    const bottom = centerY + rise;
    pathD = `M 0 ${centerY} L ${endBreakX} ${centerY} L ${lineWidth} ${bottom}`;
    labelY = bottom;
  }

  return (
    <div
      style={{
        position: 'absolute',
        ...position,
        width: 0,
        height: 0,
      }}
    >
      {/* Dot — locked at the anchor point. Never moves.
          The button itself is 32x32 (generous click target); the visible
          12x12 dot is rendered as a centred child. */}
      <button
        type="button"
        onClick={() => interactive && onToggle()}
        aria-pressed={expanded}
        aria-label={label}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 32,
          height: 32,
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          cursor: interactive ? 'pointer' : 'default',
          pointerEvents: interactive ? 'auto' : 'none',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: PALETTE.ink,
          }}
        />
      </button>

      {/* SVG callout + label — purely additive. Hidden state = nothing
          visible besides the dot. Expanded state = path draws, label fades. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: -centerY,
          width: lineWidth + 240,
          height: lineHeight,
          pointerEvents: 'none',
        }}
      >
        <svg
          width={lineWidth}
          height={lineHeight}
          style={{ display: 'block', position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
        >
          <path
            d={pathD}
            stroke={PALETTE.ink}
            strokeWidth="1"
            fill="none"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={expanded ? 0 : 100}
            style={{
              transition:
                'stroke-dashoffset 0.6s cubic-bezier(.55,0,.1,1)',
            }}
          />
        </svg>
        <span
          style={{
            position: 'absolute',
            left: lineWidth + 8,
            top: labelY - 8,
            fontSize: 'clamp(10px, 0.85vw, 12px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: PALETTE.ink,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.3s ease 0.35s',
          }}
          className="font-nav"
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function HybridRemoverSection({ locale = 'tr', onNavVisibilityChange }) {
  const dict = getDictionary(locale).hybrid;

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const scene1Ref = useRef(null);
  const scene2ItalicRef = useRef(null);
  const scene2FolioRef = useRef(null);
  const bottleRef = useRef(null);
  const floatRef = useRef(null);
  const bottleShadowRef = useRef(null);
  const tagsRef = useRef(null);
  const boxRef = useRef(null);
  const spinLogoRef = useRef(null);
  const dotsLayerRef = useRef(null);
  const marqueeRef = useRef(null);

  const navHiddenRef = useRef(false);
  const onNavVisibilityChangeRef = useRef(onNavVisibilityChange);
  useEffect(() => {
    onNavVisibilityChangeRef.current = onNavVisibilityChange;
  }, [onNavVisibilityChange]);

  // Interactive dots — true once the bottle has landed and Scene 6 is showing.
  const [interactive, setInteractive] = useState(false);
  const [expandedSet, setExpandedSet] = useState(() => new Set());
  const interactiveRef = useRef(false);
  const floatPausedRef = useRef(false);
  const floatTlRef = useRef(null);
  const gsapRef = useRef(null);

  const toggleDot = (i) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    let cancelled = false;
    let ctx;
    let floatTl;

    (async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      // Continuous gentle float on the bottle image — independent of scroll
      // and of the tag bobs. It is explicitly resumed only during the Scene 3
      // floating-tag shot so the product visibly bobs there, then settles.
      floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: 'sine.inOut' },
      });
      floatTl
        .to(floatRef.current, { y: -18, rotation: 1.2, duration: 3.4 })
        .to(floatRef.current, { y: 0, rotation: -1.0, duration: 3.4 });
      floatTl.pause(0);
      floatTlRef.current = floatTl;
      floatPausedRef.current = true;
      gsapRef.current = gsap;

      ctx = gsap.context(() => {
        gsap.set(scene1Ref.current, { opacity: 0, y: 24, filter: 'blur(0px)' });
        gsap.set([scene2ItalicRef.current, scene2FolioRef.current], {
          opacity: 0,
          y: 28,
          filter: 'blur(0px)',
        });
        gsap.set(bottleRef.current, {
          opacity: 0,
          scale: 0.94,
          x: 0,
          y: 0,
          rotation: 0,
        });
        gsap.set(bottleShadowRef.current, {
          opacity: 0,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        });
        gsap.set(tagsRef.current, { opacity: 0 });
        gsap.set(boxRef.current, { opacity: 1, y: '70vh', rotation: -2 });
        gsap.set(spinLogoRef.current, { opacity: 0, scale: 0.96 });
        gsap.set(dotsLayerRef.current, { opacity: 0 });
        gsap.set(marqueeRef.current, { opacity: 0, y: 40 });

        const emitNavVisibility = (hidden) => {
          if (hidden !== navHiddenRef.current) {
            navHiddenRef.current = hidden;
            onNavVisibilityChangeRef.current?.(hidden);
          }
        };

        const setInteractiveGuarded = (next) => {
          if (next !== interactiveRef.current) {
            interactiveRef.current = next;
            setInteractive(next);
          }
        };

        // Pause/resume the continuous float based on scroll progress.
        const setFloatPaused = (paused) => {
          if (paused === floatPausedRef.current) return;
          floatPausedRef.current = paused;
          const fl = floatTlRef.current;
          const g = gsapRef.current;
          if (!fl || !g) return;
          if (paused) {
            fl.pause();
            g.to(floatRef.current, {
              y: 0,
              rotation: 0,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: true,
            });
          } else {
            fl.resume();
          }
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            pin: pinRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              emitNavVisibility(self.progress > 0.02 && self.progress < 0.90);
              setInteractiveGuarded(self.progress >= 0.86);
              setFloatPaused(!(self.progress >= 0.38 && self.progress < 0.55));
            },
            onLeaveBack: () => {
              emitNavVisibility(false);
              setInteractiveGuarded(false);
              setFloatPaused(true);
            },
            onLeave: () => {
              emitNavVisibility(false);
              setInteractiveGuarded(false);
              setFloatPaused(true);
            },
          },
        });

        // ── Scene 01 ──────────────────────────────────────────────────
        tl.to(scene1Ref.current, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.04);
        tl.to(scene1Ref.current, { opacity: 1, duration: 0.05 }, 0.10);
        tl.to(scene1Ref.current, { opacity: 0, y: -30, filter: 'blur(8px)', duration: 0.04 }, 0.15);

        // ── Scene 02 ──────────────────────────────────────────────────
        tl.to(scene2ItalicRef.current, { opacity: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.20);
        tl.to(scene2FolioRef.current, { opacity: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.23);
        tl.to(scene2ItalicRef.current, { letterSpacing: '-0.025em', duration: 0.04 }, 0.30);
        tl.to(scene2FolioRef.current, { letterSpacing: '0.26em', duration: 0.04 }, 0.30);
        tl.to(
          [scene2ItalicRef.current, scene2FolioRef.current],
          { opacity: 0, y: -30, filter: 'blur(8px)', duration: 0.04 },
          0.33
        );

        // ── Scene 03  centred bottle + tags ──────────────────────────
        tl.to(bottleRef.current, { opacity: 1, scale: 1, duration: 0.08, ease: 'power3.out' }, 0.38);
        tl.to(bottleShadowRef.current, { opacity: 0.32, duration: 0.08 }, 0.38);
        tl.to(tagsRef.current, { opacity: 1, duration: 0.06 }, 0.46);

        // ── Scene 04  bottle drifts LEFT (stays vertically centred);
        //             closed box rises up to settle right next to it.
        //             The whole pair lands on the LEFT third of the viewport. */
        tl.to(tagsRef.current, { opacity: 0, duration: 0.04 }, 0.55);
        tl.to(
          bottleRef.current,
          {
            x: '-32vw',
            y: '0vh',
            rotation: 0,
            scale: 0.74,
            duration: 0.15,
            ease: 'power2.inOut',
          },
          0.55
        );
        tl.to(
          bottleShadowRef.current,
          {
            x: '-32vw',
            y: '0vh',
            scaleX: 0.72,
            opacity: 0.22,
            duration: 0.15,
            ease: 'power2.inOut',
          },
          0.55
        );
        // Closed box rises from below into its centred position (parallax).
        tl.to(
          boxRef.current,
          {
            y: '0vh',
            rotation: 0,
            duration: 0.16,
            ease: 'power2.out',
          },
          0.55
        );

        // ── Scene 05  bottle settles into its final spot, touching the box.
        //             Spinning logo fades in on the far right. ─────────────
        tl.to(
          bottleRef.current,
          {
            x: '-38vw',
            y: '0vh',
            rotation: 0,
            scale: 0.92,
            duration: 0.16,
            ease: 'power3.inOut',
          },
          0.70
        );
        tl.to(
          bottleShadowRef.current,
          {
            x: '-38vw',
            y: '0vh',
            scaleX: 0.88,
            scaleY: 0.76,
            opacity: 0.20,
            duration: 0.16,
            ease: 'power3.inOut',
          },
          0.70
        );
        tl.to(
          spinLogoRef.current,
          { opacity: 1, scale: 1, duration: 0.10, ease: 'power2.out' },
          0.74
        );

        // ── Scene 06  ingredient dots in, marquee rises in ───────────
        tl.to(dotsLayerRef.current, { opacity: 1, duration: 0.06 }, 0.88);
        tl.to(
          marqueeRef.current,
          { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.94
        );
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      if (floatTl) floatTl.kill();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '600vh', backgroundColor: PALETTE.ivory }}
      aria-label="Hybrid Remover product reveal"
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: PALETTE.ivory }}
      >
        {/* SCENE 01 typography */}
        <div className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none">
          <h2
            ref={scene1Ref}
            className="font-logo italic text-center"
            style={{
              color: PALETTE.ink,
              fontSize: 'clamp(40px, 6.6vw, 110px)',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              fontWeight: 500,
            }}
          >
            {dict.scene1}
          </h2>
        </div>

        {/* SCENE 02 typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 pointer-events-none">
          <div
            ref={scene2ItalicRef}
            className="font-logo italic text-center"
            style={{
              color: PALETTE.ink,
              fontSize: 'clamp(52px, 8.4vw, 132px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            {dict.scene2Italic}
          </div>
          <div
            ref={scene2FolioRef}
            className="font-nav uppercase text-center"
            style={{
              color: PALETTE.inkSoft,
              fontSize: 'clamp(13px, 1.4vw, 22px)',
              letterSpacing: '0.30em',
              fontWeight: 500,
            }}
          >
            {dict.scene2Folio}
          </div>
        </div>

        {/* CLOSED BOX — sits on the LEFT third of the viewport, immediately
            to the right of the bottle but past the bottle's visible right
            edge so the bottle isn't covered. Vertically centred. */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            left: '3vw',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 20,
          }}
        >
          <div
            ref={boxRef}
            className="relative hidden lg:block"
            style={{
              height: 'clamp(560px, 84vh, 960px)',
              aspectRatio: '4 / 5',
              filter: 'drop-shadow(0 40px 50px rgba(20,15,10,0.20))',
            }}
          >
            <Image
              src="/images/remover_box.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, 70vw"
              className="object-contain"
              priority={false}
            />
          </div>
        </div>

        {/* BOTTLE SHADOW */}
        <div
          ref={bottleShadowRef}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: 'clamp(260px, 28vw, 500px)',
            height: 'clamp(36px, 3.6vw, 64px)',
            transform: 'translate(-50%, calc(50% + clamp(300px, 32vh, 420px)))',
            background:
              'radial-gradient(50% 60% at 50% 50%, rgba(40,30,18,0.40) 0%, rgba(40,30,18,0) 75%)',
            filter: 'blur(22px)',
            zIndex: 10,
          }}
        />

        {/* BOTTLE — outer scrub-driven wrapper centred via flex.
            Inner stack: bottle image only. The scene tags live in a pinned
            viewport overlay so they can spread beyond the product frame. */}
        <div
          ref={bottleRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 15 }}
        >
          <div
            className="relative"
            style={{
              height: 'clamp(420px, 72vh, 880px)',
              aspectRatio: '4 / 5',
            }}
          >
            {/* Bottle image — continuous gentle float on its own */}
            <div
              ref={floatRef}
              className="absolute inset-0"
              style={{
                filter: 'drop-shadow(0 40px 50px rgba(20,15,10,0.22))',
              }}
            >
              <Image
                src="/images/remover.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 92vw"
                className="object-contain"
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* FLOATING PRODUCT TAGS (Scene 3) — clipped by the pinned viewport
            so the glass pills never appear outside the Hybrid Remover shot. */}
        <div ref={tagsRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 18 }}>
          {dict.floatingTags.map((label, i) => {
            const layout = FLOATING_TAG_LAYOUT[i % FLOATING_TAG_LAYOUT.length];
            const { className, duration, delay, amplitude, ...style } = layout;
            return (
              <FloatTag
                key={`${label}-${i}`}
                style={style}
                className={className}
                label={label}
                duration={duration}
                delay={delay}
                amplitude={amplitude}
              />
            );
          })}
        </div>

        {/* SPINNING LOGO (Scene 6) — right side, black.
            Mobile: pulled up so it clears the bottle's centred text/CTAs.
            md+: vertically centred. */}
        <div
          ref={spinLogoRef}
          className="absolute pointer-events-none hidden md:block md:top-1/2"
          style={{
            right: '5vw',
            transform: 'translateY(-50%)',
            zIndex: 25,
          }}
        >
          <SpinningLogoBlack label={dict.spinningLabel} />
        </div>

        {/* INTERACTIVE DOTS LAYER (Scene 6) — the bottle+box pair now lives
            on the LEFT third of the viewport, so the only honest empty
            space for ingredient annotations is the wide gap between the
            box and the spinning logo on the right. Anchored there. */}
        <div
          ref={dotsLayerRef}
          className="absolute"
          style={{
            left: '28vw',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: '40vh',
            zIndex: 40,
            // No pointerEvents:'none' here — the buttons inside manage their
            // own clickability based on the `interactive` flag.
          }}
        >
          {dict.ingredients.map((label, i) => {
            const positions = [
              { top: '4%', left: 0 },
              { top: '22%', left: 0 },
              { top: '40%', left: 0 },
              { top: '58%', left: 0 },
              { top: '76%', left: 0 },
              { top: '94%', left: 0 },
            ];
            return (
              <IngredientDot
                key={i}
                index={i}
                totalDots={dict.ingredients.length}
                position={positions[i] || { top: '50%', left: 0 }}
                label={label}
                expanded={expandedSet.has(i)}
                interactive={interactive}
                onToggle={() => toggleDot(i)}
              />
            );
          })}
        </div>

        {/* MARQUEE (Scene 6) — oversized italic "SHINING BROWS" band
            looping horizontally at the bottom of the pinned viewport.
            Sits BEHIND the other scene 6 elements (zIndex 8). */}
        <div
          ref={marqueeRef}
          className="absolute left-0 right-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 8, bottom: '2vh', paddingBottom: '0.22em' }}
          aria-hidden
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'marquee-left 70s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="font-logo italic"
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(120px, 10vw, 380px)',
                  fontWeight: 500,
                  color: PALETTE.ink,
                  lineHeight: 1.12,
                  paddingBottom: '0.1em',
                  paddingRight: '4vw',
                  textTransform: 'none',
                }}
              >
                shining brows
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
