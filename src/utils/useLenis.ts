import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Initialises a Lenis smooth-scroll instance on the provided
 * HTMLElement wrapper.  Returns a cleanup function (for useEffect).
 */
export function useLenis(wrapperRef: React.RefObject<HTMLElement | null>) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const lenis = new Lenis({
      wrapper: el,
      content: el,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [wrapperRef]);

  return lenisRef;
}
