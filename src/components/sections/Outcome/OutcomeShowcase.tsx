"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/scroll";
import { bp, prefersReducedMotion, useMediaQuery } from "@/lib/motion";
import styles from "./Outcome.module.css";
import { ASSETS } from "@/lib/paths";

const steps = [
  {
    n: "01",
    tab: "Reporting",
    title: "Account-level reporting",
    body: "See pipeline by account and by committee, with every person’s engagement in one view.",
    alt: "Weekly reporting view in the Xpansly app listing Northwind, Argo Data, Helix Cloud and Pallas AI by how much of each buying committee is engaged",
  },
  {
    n: "02",
    tab: "Forecast",
    title: "Forecast with confidence",
    body: "Know which accounts are moving towards a decision, and how sure you can be about each one.",
    alt: "Quarterly forecast view in the Xpansly app with a bar chart and accounts ranked by confidence: High for Northwind, Medium for Helix Cloud, Low for Pallas AI",
  },
  {
    n: "03",
    tab: "Source of truth",
    title: "One source of truth",
    body: "One data layer underneath everything, so the numbers match wherever you look.",
    alt: "Data sync view in the Xpansly app showing CRM, ads, email, website and LinkedIn feeding one data layer, with the same Northwind figure in the forecast and the board report",
  },
] as const;

const SIZES = "(min-width: 768px) 632px, calc(100vw - 40px)";

function PanelImage({ index, alt, lazy = true }: { index: number; alt: string; lazy?: boolean }) {
  const base = `${ASSETS}/outcome/outcome-panel-${index + 1}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}-630.avif 630w, ${base}-1260.avif 1260w`} sizes={SIZES} />
      <source type="image/webp" srcSet={`${base}-630.webp 630w, ${base}-1260.webp 1260w`} sizes={SIZES} />
      <img
        src={`${base}-1260.webp`}
        width={630}
        height={538}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        className={styles.img}
      />
    </picture>
  );
}

export function OutcomeShowcase() {
  const isDesktop = useMediaQuery(bp.desktop);
  const [active, setActive] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lock = useRef<number | null>(null);

  /** Which item covers the viewport centre (used to resync after a tab-driven scroll). */
  const syncFromScroll = useCallback(() => {
    const mid = window.innerHeight / 2;
    let next = -1;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) next = i;
    });
    if (next >= 0) setActive(next);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (lock.current !== null) return;
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = itemRefs.current.indexOf(e.target as HTMLLIElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isDesktop]);

  useEffect(
    () => () => {
      if (lock.current !== null) window.clearTimeout(lock.current);
    },
    [],
  );

  const goTo = (i: number) => {
    const el = contentRefs.current[i];
    if (!el) return;
    setActive(i);
    const release = () => {
      if (lock.current !== null) window.clearTimeout(lock.current);
      lock.current = null;
      syncFromScroll();
    };
    if (lock.current !== null) window.clearTimeout(lock.current);
    lock.current = window.setTimeout(release, 1600);
    // Put the text block of the step on the viewport centre. An absolute target is used
    // (not the element) because Lenis would subtract the global scroll-padding-top.
    const r = el.getBoundingClientRect();
    const top = Math.max(0, r.top + window.scrollY + r.height / 2 - window.innerHeight / 2);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(top, { onComplete: release });
    } else {
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      lock.current = window.setTimeout(release, prefersReducedMotion() ? 50 : 900);
    }
  };

  return (
    <div className={`grid ${styles.columns}`}>
      <div className={styles.left}>
        <div className={styles.sticky}>
          <div className={styles.panel}>
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={styles.layer}
                data-active={active === i || undefined}
                aria-hidden={active === i ? undefined : true}
              >
                <PanelImage index={i} alt={s.alt} />
              </div>
            ))}
          </div>
          <div className={styles.tabs} role="group" aria-label="Outcome views">
            {steps.map((s, i) => (
              <button
                key={s.n}
                type="button"
                className={`t-label-sm ${styles.tab}`}
                data-active={active === i || undefined}
                aria-pressed={active === i}
                onClick={() => goTo(i)}
              >
                {s.tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ol className={styles.right}>
        {steps.map((s, i) => (
          <li
            key={s.n}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={styles.item}
            data-active={active === i || undefined}
            aria-current={isDesktop && active === i ? "true" : undefined}
          >
            <div className={styles.inlinePanel}>
              <PanelImage index={i} alt={s.alt} />
            </div>
            <div
              className={styles.content}
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
            >
              <span className={`t-label ${styles.num}`}>
                <span className="sr-only">Step </span>
                {s.n}
              </span>
              <h3 className={`t-h2 ${styles.itemTitle}`}>{s.title}</h3>
              <p className={`t-body-lg ${styles.itemBody}`}>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
