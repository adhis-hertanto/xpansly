import type { Colourway } from "./palette";

/*
 * Scene settings for the live planet art, one per placement. Values are in the Xpansly Visual
 * Generator's own units (its shape box), so its settings carry over unchanged. Each scene also
 * records how its static poster was cut from a generator export, so the canvas lines up with it.
 */
export type Blob = [x: number, y: number, r: number, colour: "a" | "b" | "h", strength: number];

export type Scene = {
  colourway: Colourway;
  /** Static poster size and object-position (mobile/tablet, then >= 1200px). */
  poster: { w: number; h: number; pos: [number, number]; posDesktop: [number, number] };
  /** Shape box inside the poster, in poster widths; flip = the export was rotated 180 degrees. */
  box: { S: number; BX: number; BY: number; asp: number; flip: boolean };
  /** Poster widths covered by the generator's 760px preview (sets grain and dither size). */
  ref: number;
  /** planet: glow outside a circle. wave: glow inside a huge circle, seen as a horizon arc. */
  mode: "planet" | "wave";
  C: [number, number];
  R: number;
  light: number;
  /** Range the pointer can swing the light through (degrees, generator convention). */
  lightMin: number;
  lightMax: number;
  spread: number;
  /** Angular reach of the crisp rim line (wider than the glow, so the outline runs further). */
  rimSpread: number;
  glow: number;
  rim: number;
  rimGlow: number;
  fade: number;
  soft0: number;
  innerR: number;
  /** GLSL expression the generator uses for its edge-fade ramp. */
  softAxis: string;
  /** Contrast of the outer glow (1 + 4 x space) and mesh veil strength. */
  dgam: number;
  meshS: number;
  blobs: Blob[];
  lines: boolean;
  dither: null | { style: "pill" | "pix"; cell: number; inten: number; cov: number; brk: number; con: number };
  /** Film grain strength (1 = generator grain 55). */
  grain: number;
  silk: number;
};

/** Hero: Planet mode, Blue, Solar Pulse lines, no dither. Poster = 2x export turned 180 degrees. */
export const HERO_SCENE: Scene = {
  colourway: "blue",
  poster: { w: 2880, h: 1778, pos: [0.78, 0.3], posDesktop: [0.5, 0.5] },
  box: { S: 0.7146, BX: 0.3764, BY: 0.0243, asp: 1, flip: true },
  ref: 0.7146,
  mode: "planet",
  C: [0.3, 0.3],
  R: 0.5,
  light: -35,
  lightMin: -110,
  lightMax: 40,
  spread: 70,
  rimSpread: 105,
  glow: 0.55,
  rim: 0.003,
  rimGlow: 0.03,
  fade: 0.1,
  soft0: 0.0035,
  innerR: 0.08,
  softAxis: "uv.y",
  dgam: 4.2,
  meshS: 0.0847,
  blobs: [
    [0.1, 0.92, 0.42, "h", 0.5],
    [0.4, 1.02, 0.45, "h", 0.55],
    [0.95, 0.8, 0.45, "a", 0.5],
    [0.92, 0.02, 0.3, "b", 0.4],
    [0.6, 0.5, 0.4, "h", 0.18],
  ],
  lines: true,
  dither: null,
  grain: 0.35,
  silk: 0.024,
};

const WAVE_ASP = 490 / 760;
const WAVE_R = (0.881 * 1.15) / 0.829;

/** Sign-up: Wave mode (arc 1, light -62), Ember, pixel dither. Poster = 2x export turned 180 degrees at ~73% zoom. */
export const SIGNUP_SCENE: Scene = {
  colourway: "ember",
  poster: { w: 1520, h: 980, pos: [0.5, 0.5], posDesktop: [0.5, 0.5] },
  box: { S: 0.7316, BX: 0.1454, BY: 0.2322, asp: WAVE_ASP, flip: true },
  ref: 1,
  mode: "wave",
  C: [0.5, 0.58 * WAVE_ASP - WAVE_R],
  R: WAVE_R,
  light: -62,
  lightMin: -125,
  lightMax: -50,
  spread: 30,
  rimSpread: 48,
  glow: 0.3,
  rim: 0.003,
  rimGlow: 0.04,
  fade: 0.14,
  soft0: 0.0035,
  innerR: 1.2 * 0.16,
  softAxis: "uv.x",
  dgam: 4.6,
  meshS: 0.05,
  blobs: [
    [0.05, 0.95 * WAVE_ASP, 0.45, "h", 0.5],
    [0.95, 0.9 * WAVE_ASP, 0.5, "a", 0.55],
    [0.5, 0.62 * WAVE_ASP, 0.45, "b", 0.32],
    [0.1, 0.1 * WAVE_ASP, 0.3, "h", 0.1],
  ],
  lines: false,
  dither: { style: "pix", cell: 8, inten: 70, cov: 55, brk: 35, con: 50 },
  grain: 0.35,
  silk: 0.024,
};
