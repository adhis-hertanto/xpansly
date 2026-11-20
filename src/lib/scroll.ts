"use client";

import type Lenis from "lenis";

/** Single shared Lenis instance (null when reduced motion is on or before mount). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Scroll to an in-page section by id, through Lenis when active, and move focus there. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    // Lenis already subtracts the root scroll-padding-top (the nav height, see base.css).
    lenis.scrollTo(el);
  } else {
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - pad;
    window.scrollTo({ top, behavior: "smooth" });
  }
  // Move focus for keyboard and screen reader users without a second jump.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}
