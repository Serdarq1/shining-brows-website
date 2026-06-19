'use client';
import { useEffect, useRef, useState } from 'react';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * FeedbacksSection — "Story / Shining Brows" panel.
 *
 * Layout
 *   • Ivory background — matches the home-page Courses section.
 *   • Stacked editorial headline ("STORY" roman + "— Shining Brows" italic).
 *   • An always-moving 9:16 video marquee. The tile content is rendered
 *     twice and `xPercent` is tweened 0 → -50 forever with `ease: 'none'`
 *     for a seamless loop.
 *
 * Click-to-play
 *   • Clicking any tile pauses the marquee and opens a centered lightbox
 *     with a dark backdrop, an enlarged 9:16 player, and an ✕ close
 *     control. ESC and clicking the backdrop also close.
 *   • Closing the lightbox resumes the marquee.
 *
 * Preview frames
 *   • No more random poster images — each <video> requests its first
 *     frame via the `#t=0.1` fragment, which causes the browser to seek
 *     and paint the frame as the static preview before play.
 *
 * Video assets — drop the files into `public/videos/` using the paths in
 * `FEEDBACK_VIDEOS` below.
 * ------------------------------------------------------------------------- */

const FEEDBACK_VIDEOS = [
  { src: '/videos/story-1.mp4' },
  { src: '/videos/story-2.mp4' },
  { src: '/videos/story-3.mp4' },
  { src: '/videos/story-4.mp4' },
  { src: '/videos/story-5.mp4' },
  { src: '/videos/story-6.mp4' },
  { src: '/videos/story-7.mp4' },
  { src: '/videos/story-8.mp4' },
];

// Seconds for one full pass of the marquee. Bigger = slower drift.
const MARQUEE_DURATION = 70;

// Many of the testimonial videos open with a fade-in from black, so the
// very first frame is dark. We seek a couple of seconds in for the
// preview thumbnail so the tile shows the speaker, not the fade.
const PREVIEW_SEEK = 7;

export default function FeedbacksSection({ locale = 'tr' }) {
  const dict = getDictionary(locale).story;
  const revealRef = useGsapReveal();

  const marqueeRef = useRef(null);
  const tweenRef = useRef(null);
  const modalVideoRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(null);
  const [modalRevealed, setModalRevealed] = useState(false);

  // ── Boot the infinite marquee ──────────────────────────────────────
  useEffect(() => {
    if (!marqueeRef.current) return;
    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled) return;
      const gsap = gsapMod.default;

      ctx = gsap.context(() => {
        tweenRef.current = gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: MARQUEE_DURATION,
          ease: 'none',
          repeat: -1,
        });
      }, marqueeRef);
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
      tweenRef.current = null;
    };
  }, []);

  // ── Pause/resume marquee when lightbox opens/closes ────────────────
  useEffect(() => {
    if (!tweenRef.current) return;
    if (activeIndex !== null) tweenRef.current.pause();
    else tweenRef.current.play();
  }, [activeIndex]);

  // ── Lightbox: ESC handler + body scroll lock + entrance reveal ────
  useEffect(() => {
    if (activeIndex === null) {
      setModalRevealed(false);
      return;
    }

    const id = requestAnimationFrame(() => setModalRevealed(true));
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // ── Play the modal video as soon as it mounts with a new index ────
  useEffect(() => {
    if (activeIndex === null || !modalVideoRef.current) return;
    const v = modalVideoRef.current;
    try {
      v.currentTime = 0;
      v.muted = false;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {}
  }, [activeIndex]);

  const handleTileClick = (realIndex) => setActiveIndex(realIndex);
  const handleClose = () => setActiveIndex(null);

  // Render the tiles twice for the seamless loop.
  const doubled = [...FEEDBACK_VIDEOS, ...FEEDBACK_VIDEOS];
  const TOTAL = FEEDBACK_VIDEOS.length;

  return (
    <section
      ref={revealRef}
      className="relative overflow-hidden text-charcoal py-28 md:py-40"
      style={{ backgroundColor: '#F7F4EE' }}
      aria-label={dict.ariaLabel}
    >
      {/* ── Editorial header ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10 mb-14 md:mb-24">
        <h2
          className="reveal font-logo text-charcoal uppercase"
          style={{
            fontSize: 'clamp(44px, 13vw, 240px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            fontWeight: 500,
          }}
        >
          {dict.title}
        </h2>
        <div
          className="reveal font-logo italic text-charcoal mt-3 md:mt-5 flex items-baseline gap-3 md:gap-7"
          style={{
            fontSize: 'clamp(30px, 11vw, 210px)',
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
              width: 'clamp(24px, 7vw, 130px)',
              background: '#111',
              transform: 'translateY(-0.6em)',
              flex: '0 0 auto',
            }}
          />
          <span className="break-words">{dict.subline}</span>
        </div>
      </div>

      {/* ── Marquee row ────────────────────────────────────────────── */}
      <div className="reveal relative w-full">
        <div
          ref={marqueeRef}
          className="flex gap-5 md:gap-7 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {doubled.map((item, i) => {
            const realIndex = i % TOTAL;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleTileClick(realIndex)}
                className={[
                  'group relative shrink-0 overflow-hidden rounded-[4px]',
                  'shadow-[0_24px_60px_rgba(0,0,0,0.18)]',
                  'transition-transform duration-500 hover:-translate-y-1',
                  'bg-neutral-900',
                ].join(' ')}
                style={{
                  width: 'clamp(180px, 18vw, 280px)',
                  aspectRatio: '9 / 16',
                }}
                aria-label="Play story"
              >
                {/* The `#t={PREVIEW_SEEK}` fragment makes the browser seek
                    past the opening fade-in and paint a later frame as
                    the preview, so tiles show the speaker on camera
                    rather than a black frame. */}
                <video
                  src={`${item.src}#t=${PREVIEW_SEEK}`}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0"
                  style={{ background: 'rgba(0,0,0,0.18)' }}
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-charcoal text-xl transition-transform duration-500 group-hover:scale-110"
                    style={{ paddingLeft: 3 }}
                  >
                    ▶
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      {activeIndex !== null && (
        <div
          className={[
            'fixed inset-0 z-[80] flex items-center justify-center',
            'transition-opacity duration-500',
            modalRevealed ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop — click to close */}
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute inset-0 cursor-zoom-out"
            style={{
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* ✕ close button */}
          <button
            type="button"
            aria-label="Close story"
            onClick={handleClose}
            className="absolute top-5 right-5 md:top-8 md:right-8 z-10 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 text-ivory text-xl md:text-2xl hover:bg-white/20 transition-colors"
          >
            <span aria-hidden style={{ lineHeight: 1, transform: 'translateY(-1px)' }}>✕</span>
          </button>

          {/* Centered 9:16 player */}
          <div
            className={[
              'relative z-10 transition-transform duration-500 ease-out',
              modalRevealed ? 'scale-100' : 'scale-95',
            ].join(' ')}
            style={{
              height: 'min(86vh, 920px)',
              aspectRatio: '9 / 16',
              maxWidth: '92vw',
            }}
          >
            <video
              key={activeIndex}
              ref={modalVideoRef}
              src={FEEDBACK_VIDEOS[activeIndex].src}
              playsInline
              controls
              autoPlay
              className="absolute inset-0 h-full w-full rounded-[6px] object-cover shadow-[0_40px_120px_rgba(0,0,0,0.55)] bg-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}
