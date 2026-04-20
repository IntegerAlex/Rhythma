import { useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";

/**
 * Initialises a Lenis smooth-scroll instance on the provided
 * HTMLElement wrapper and returns a ref containing the current
 * Lenis instance. Setup and cleanup are handled internally by
 * the hook's useEffect lifecycle.
 */
export function useLenis(wrapperRef: RefObject<HTMLElement | null>) {
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
