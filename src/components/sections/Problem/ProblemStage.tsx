"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/motion";
import { MarkLayer } from "./MarkLayer";
import styles from "./Problem.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Scroll map over the section (0 = section top meets viewport top, 1 = section bottom meets viewport bottom):
 *   0.00-0.12  black, nothing
 *   0.12-0.25  heading fades in, centred
 *   0.25-0.60  cubes converge (scene progress 0 -> 0.95), radial scrim fades in
 *   0.60-0.68  mark settles (-> 1)
 *   0.68-0.95  cards arrive one by one (starts 0.68, 0.78, 0.88, each over 0.07),
 *              the heading + cards block re-centres upward as each card is added
 * One value (p) drives everything; it is written into refs / CSS variables, never into React state.
 */
const CARD_START = [0.68, 0.78, 0.88] as const;
const CARD_DUR = 0.07;

export function ProblemStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0); // scene converge progress (read by the canvas every frame)
  const reduced = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const section = stage?.parentElement;
    if (reduced || !stage || !section) return;

    const content = stage.querySelector<HTMLElement>("[data-content]");
    const heading = stage.querySelector<HTMLElement>("[data-heading]");
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    if (!content || !heading || cards.length === 0) return;

    // How much vertical space each card adds to the block (gap + card), measured, so it is responsive.
    let slots: number[] = [];
    const measure = () => {
      let prevBottom = heading.offsetTop + heading.offsetHeight;
      slots = cards.map((c) => {
        const bottom = c.offsetTop + c.offsetHeight;
        const slot = bottom - prevBottom;
        prevBottom = bottom;
        return slot;
      });
    };
    measure();
    const ro = new ResizeObserver(() => {
      measure();
      apply(last);
    });
    ro.observe(content);

    const cache: Record<string, number> = {};
    const set = (name: string, v: number, digits = 3) => {
      const r = Number(v.toFixed(digits));
      if (cache[name] === r) return;
      cache[name] = r;
      stage.style.setProperty(name, String(r));
    };

    let last = 0;
    function apply(p: number) {
      last = p;
      // Scene progress: 0 until 0.25, 0 -> 0.95 until 0.60, then settle to 1 by 0.68.
      const sceneP =
        p < 0.25 ? 0 : p < 0.6 ? (0.95 * (p - 0.25)) / 0.35 : p < 0.68 ? 0.95 + (0.05 * (p - 0.6)) / 0.08 : 1;
      progress.current = sceneP;

      set("--h", smooth(0.12, 0.25, p));
      set("--scrim", smooth(0.25, 0.34, p));
      set("--pf", smooth(0.5, 0.68, p));

      let ty = 0;
      for (let i = 0; i < cards.length; i++) {
        const a = easeOut(clamp01((p - CARD_START[i]) / CARD_DUR));
        set(`--a${i}`, a);
        ty += (1 - a) * (slots[i] ?? 0);
      }
      set("--ty", ty / 2, 1);
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(st.progress);

    return () => {
      st.kill();
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div ref={stageRef} className={styles.stage}>
      <MarkLayer progress={progress} reduced={reduced} />
      <div className={styles.scrim} aria-hidden="true" />
      {children}
    </div>
  );
}
