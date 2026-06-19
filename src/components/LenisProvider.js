'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }) {
  useEffect(() => {
    let lenis;
    let rafId;
    let cancelled = false;
    let gsapInstance;
    let ScrollTriggerInstance;

    (async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsapInstance = gsapMod.default;
      ScrollTriggerInstance = stMod.ScrollTrigger || stMod.default;
      gsapInstance.registerPlugin(ScrollTriggerInstance);

      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on('scroll', ScrollTriggerInstance.update);
      gsapInstance.ticker.add((time) => lenis.raf(time * 1000));
      gsapInstance.ticker.lagSmoothing(0);

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return children;
}
