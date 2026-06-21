'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function LenisProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    let lenis;
    let cancelled = false;
    let gsapInstance;
    let ScrollTriggerInstance;
    let updateLenis;

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
      updateLenis = (time) => lenis.raf(time * 1000);
      gsapInstance.ticker.add(updateLenis);
      gsapInstance.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      if (gsapInstance && updateLenis) gsapInstance.ticker.remove(updateLenis);
      if (lenis) lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
