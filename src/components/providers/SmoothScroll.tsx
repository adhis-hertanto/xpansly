"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in sync.
 * Both libraries are imported on demand after hydration, keeping them out of the initial JS.
 * Disabled entirely under prefers-reduced-motion (native scrolling instead).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        setLenis(lenis);
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        cleanup = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          setLenis(null);
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
