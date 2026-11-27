"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./DitherField.module.css";

/*
 * Ambient dither field: a grid of brand-coloured squares whose opacity drifts with a slow
 * sine-noise field plus a per-cell twinkle. One viewport-sized canvas sits sticky behind a
 * run of sections, rendered at 1x and throttled to ~20fps. A blurred copy gives the glow,
 * a faint sharp copy keeps the pixel texture. It pauses off-screen and when the tab is hidden,
 * and draws one still frame for prefers-reduced-motion.
 */

// Brand ramp picks (tokens.css): purple-300, blue-400, cyan-300, white. Weights sum to 1.
const PALETTE: ReadonlyArray<readonly [string, number]> = [
  ["#c769ff", 0.42],
  ["#149dff", 0.3],
  ["#23c7ed", 0.13],
  ["#ffffff", 0.15],
];
const FRAME_MS = 50;
const MAX_ALPHA = 0.55; // per cell, before the CSS layer opacities scale it down
const MIN_ALPHA = 0.04; // cells dimmer than this are skipped

type Grid = { cols: number; rows: number; pitch: number; size: number; order: Uint32Array; colour: Uint8Array; phase: Float32Array; speed: Float32Array; starts: number[] };

function buildGrid(w: number, h: number): Grid {
  const small = w < 768;
  const size = small ? 10 : 12;
  const pitch = size + (small ? 3 : 4);
  const cols = Math.ceil(w / pitch) + 1;
  const rows = Math.ceil(h / pitch) + 1;
  const n = cols * rows;
  const colour = new Uint8Array(n);
  const phase = new Float32Array(n);
  const speed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let r = Math.random();
    let c = 0;
    while (c < PALETTE.length - 1 && r > PALETTE[c][1]) r -= PALETTE[c++][1];
    colour[i] = c;
    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = 0.35 + Math.random() * 0.6;
  }
  // Visit cells colour by colour so fillStyle changes only once per colour per frame.
  const order = new Uint32Array(n);
  const starts: number[] = [];
  let k = 0;
  for (let c = 0; c < PALETTE.length; c++) {
    starts.push(k);
    for (let i = 0; i < n; i++) if (colour[i] === c) order[k++] = i;
  }
  starts.push(n);
  return { cols, rows, pitch, size, order, colour, phase, speed, starts };
}

function draw(ctx: CanvasRenderingContext2D, g: Grid, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  const { cols, pitch, size, order, phase, speed, starts } = g;
  for (let c = 0; c < PALETTE.length; c++) {
    ctx.fillStyle = PALETTE[c][0];
    for (let k = starts[c]; k < starts[c + 1]; k++) {
      const i = order[k];
      const x = i % cols;
      const y = (i / cols) | 0;
      // Large slow blobs (two drifting sine fields), sharpened so only patches light up.
      let f = Math.sin(x * 0.11 + t * 0.21) * Math.sin(y * 0.13 - t * 0.17) + 0.6 * Math.sin((x + y) * 0.05 + t * 0.12);
      f = f * 0.5 + 0.2;
      if (f <= 0) continue;
      const tw = 0.5 + 0.5 * Math.sin(t * speed[i] + phase[i]);
      const a = MAX_ALPHA * f * f * tw;
      if (a < MIN_ALPHA) continue;
      ctx.globalAlpha = a > MAX_ALPHA ? MAX_ALPHA : a;
      ctx.fillRect(x * pitch, y * pitch, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

export function DitherField() {
  const glowRef = useRef<HTMLCanvasElement>(null);
  const sharpRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const sharp = sharpRef.current;
    const host = glow?.parentElement?.parentElement; // the absolutely positioned backdrop
    if (!glow || !sharp || !host) return;
    const ctx = glow.getContext("2d");
    const sctx = sharp.getContext("2d");
    if (!ctx || !sctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let grid: Grid | null = null;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let inView = false;
    const t0 = performance.now();

    const render = (now: number) => {
      if (!grid) return;
      draw(ctx, grid, w, h, reduced ? 12 : (now - t0) / 1000);
      sctx.clearRect(0, 0, w, h);
      sctx.drawImage(glow, 0, 0);
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
      w = glow.clientWidth;
      h = glow.clientHeight;
      if (!w || !h) return;
      glow.width = sharp.width = w;
      glow.height = sharp.height = h;
      grid = buildGrid(w, h);
      render(performance.now());
    };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, grid ? 150 : 0);
    });
    ro.observe(glow);
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
      <canvas ref={glowRef} className={styles.glow} />
      <canvas ref={sharpRef} className={styles.sharp} />
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
