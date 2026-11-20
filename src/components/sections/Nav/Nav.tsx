"use client";

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui";
import { sectionIds } from "@/config/site";
import { bp, useMediaQuery } from "@/lib/motion";
import { getLenis, scrollToId } from "@/lib/scroll";
import styles from "./Nav.module.css";
import { ASSETS } from "@/lib/paths";

/** Figma 850:143-145 (copy verbatim). Targets are in-page sections. */
const links = [
  { label: "How it works", id: sectionIds.howItWorks },
  { label: "Mira", id: sectionIds.mira },
  { label: "Who it’s for", id: sectionIds.whoItsFor },
] as const;

const FOCUSABLE = "a[href], button:not([disabled])";

function isPlainLeftClick(e: MouseEvent) {
  return !(e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
}

/**
 * Floating glass navigation (Figma 849:146).
 * Desktop (>= 1200): logo, three links and the primary CTA in an 801px glass bar.
 * Below that: logo and a menu button that opens a full-height glass sheet.
 * Links are real anchors; the click handler only adds Lenis-aware scrolling.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery(bp.desktop);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Hide on scroll down, reveal on scroll up or near the top. Read once per frame; React only
  // re-renders when the direction flips. Always shown while the menu is open or focus is inside.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const THRESHOLD = 6; // px of travel before the direction counts (ignores jitter)
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const navH = headerRef.current?.offsetHeight ?? 0;
      if (y <= navH) {
        setHidden(false);
      } else if (y - lastY > THRESHOLD) {
        // Never hide while keyboard focus is inside the nav.
        if (!headerRef.current?.contains(document.activeElement)) setHidden(true);
      } else if (lastY - y > THRESHOLD) {
        setHidden(false);
      } else {
        return; // small movement: keep accumulating from the same anchor
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The sheet does not exist on desktop, so leave the open state behind when the viewport grows.
  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  // Scroll lock, inert page content, focus handling, Escape and focus trap while open.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const main = document.getElementById("main");
    const scrollbar = window.innerWidth - html.clientWidth;
    const before = { overflow: html.style.overflow, padding: body.style.paddingRight };

    html.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    getLenis()?.stop();
    main?.setAttribute("inert", "");
    sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const nodes = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.getClientRects().length > 0,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !nodes.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = before.overflow;
      body.style.paddingRight = before.padding;
      main?.removeAttribute("inert");
      getLenis()?.start();
    };
  }, [open, closeMenu]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string, fromSheet: boolean) => {
    if (e.defaultPrevented || !isPlainLeftClick(e)) return;
    e.preventDefault();
    if (fromSheet) {
      // Unlock scrolling first, then travel; focus moves to the target section.
      setOpen(false);
      requestAnimationFrame(() => scrollToId(id));
    } else {
      scrollToId(id);
    }
  };

  return (
    <header
      ref={headerRef}
      data-site-nav
      data-hidden={hidden && !open ? "" : undefined}
      className={styles.header}
      onFocus={() => setHidden(false)}
    >
      <nav aria-label="Primary" className={styles.nav}>
        <div className={`glass ${styles.bar}`}>
          <a
            href={`#${sectionIds.hero}`}
            className={styles.logo}
            aria-label="Xpansly home"
            onClick={(e) => {
              if (e.defaultPrevented || !isPlainLeftClick(e)) return;
              e.preventDefault();
              if (open) {
                setOpen(false);
                requestAnimationFrame(() => scrollToId(sectionIds.hero));
              } else {
                scrollToId(sectionIds.hero);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/brand/xpansly-logo.svg`} alt="" width={133} height={40} />
          </a>

          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={`t-body-sm ${styles.link}`} onClick={(e) => go(e, l.id, false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <Button
            href={`#${sectionIds.cta}`}
            className={styles.cta}
            onClick={(e) => go(e, sectionIds.cta, false)}
          >
            Join early access
          </Button>

          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label="Menu"
            onClick={() => (open ? closeMenu(true) : setOpen(true))}
          >
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <div
          id={menuId}
          ref={sheetRef}
          className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
          inert={!open}
        >
          <ul className={styles.sheetList}>
            {links.map((l, i) => (
              <li key={l.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${l.id}`} className={`t-h2 ${styles.sheetLink}`} onClick={(e) => go(e, l.id, true)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            href={`#${sectionIds.cta}`}
            block
            className={styles.sheetCta}
            onClick={(e) => go(e, sectionIds.cta, true)}
          >
            Join early access
          </Button>
        </div>
      </nav>
    </header>
  );
}
