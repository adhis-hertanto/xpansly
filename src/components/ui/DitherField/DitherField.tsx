"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./DitherField.module.css";

/*
 * Ambient dither field: a coarse grid of large white squares on black whose opacity drifts
 * slowly (per-cell phase plus a slow wave across the grid), softened with a CSS blur.
 * One viewport-sized canvas sits sticky behind a run of sections, so there are only a few
 * dozen cells to draw. Throttled to ~20fps, paused off-screen and in hidden tabs, and a
 * single still frame for prefers-reduced-motion.
 */

const FRAME_MS = 50;
const MAX_ALPHA = 0.18; // brightest a cell gets (white on black)
const MIN_ALPHA = 0.008;

type Grid = { cols: number; rows: number; cell: number; ox: number; oy: number; phase: Float32Array; speed: Float32Array; tone: Float32Array };

function buildGrid(w: number, h: number): Grid {
  const cell = w < 768 ? 112 : w < 1200 ? 160 : 200;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const n = cols * rows;
  const phase = new Float32Array(n);
  const speed = new Float32Array(n);
  const tone = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = 0.18 + Math.random() * 0.32; // one full fade every ~13-35s
    tone[i] = 0.45 + Math.random() * 0.55; // some cells only ever reach grey
  }
  // Centre the grid so partial cells are split evenly between the edges.
  return { cols, rows, cell, ox: (w - cols * cell) / 2, oy: (h - rows * cell) / 2, phase, speed, tone };
}

function draw(ctx: CanvasRenderingContext2D, g: Grid, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  const { cols, rows, cell, ox, oy, phase, speed, tone } = g;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      // Per-cell fade, shaped so cells rest dark most of the time and swell briefly.
      let s = 0.5 + 0.5 * Math.sin(t * speed[i] + phase[i]);
      s = s * s * s;
      // Slow diagonal wave so neighbouring cells tend to light up in loose groups.
      const wave = 0.55 + 0.45 * Math.sin(x * 0.7 - y * 0.5 + t * 0.09);
      const a = MAX_ALPHA * tone[i] * s * wave;
      if (a < MIN_ALPHA) continue;
      ctx.globalAlpha = a;
      ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
    }
  }
  ctx.globalAlpha = 1;
}

export function DitherField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement?.parentElement; // the absolutely positioned backdrop
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let grid: Grid | null = null;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let inView = false;
    const t0 = performance.now() - 20000; // start mid-cycle so cells are already varied

    const render = (now: number) => {
      if (grid) draw(ctx, grid, w, h, reduced ? 31 : (now - t0) / 1000);
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      render(now);
    };
    const start = () => {
      if (reduced || raf || !inView || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      grid = buildGrid(w, h);
      render(performance.now());
    };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, grid ? 150 : 0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(host);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={styles.stage}>
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}

/** Wraps a run of sections and paints the dither field behind all of them. */
export function DitherBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.backdrop} aria-hidden="true">
        <DitherField />
      </div>
      {children}
    </div>
  );
}
