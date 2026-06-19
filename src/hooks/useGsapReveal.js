'use client';
import { useEffect, useRef } from 'react';

export function useGsapReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
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
        gsap.utils.toArray('.reveal', ref.current).forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: options.y ?? 40 },
            {
              opacity: 1,
              y: 0,
              duration: options.duration ?? 1.2,
              ease: options.ease ?? 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });
      }, ref.current);
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return ref;
}
