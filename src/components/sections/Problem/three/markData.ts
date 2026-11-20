/**
 * Deterministic data for the Xpansly dither "X" mark made of instanced cubes.
 *
 * The front plane is the exact 173 cell dither mask (32 x 32 grid, 6px cells in the source SVG),
 * so straight on the mark matches the artwork. Extra dithered layers in front of and behind it
 * give a small bump, thickest near the centre of mass and fading from top right to bottom left,
 * plus a short spine pointing at the camera and directly behind the mark.
 *
 * Everything is seeded, so server and client always agree. Results are memoised per quality.
 */

export type Quality = "high" | "low";

/** 32 rows, one char per cell, "1" = cube present (173 cells). */
export const MASK_ROWS: readonly string[] = [
  "00000000000000000000000000000001",
  "00000000000000000000000000000010",
  "00000000000000000000000000000100",
  "00000000000000000000000000001000",
  "00000000000000000000000000110000",
  "00000000000000000000000001010000",
  "00000000000000000000000011100000",
  "00000000000000000000001101000000",
  "00000000000000000000011010000000",
  "00000000000000000001010110000000",
  "00000100000000001011111100000000",
  "00000011010101010101010000000000",
  "00000001101011111111111000000000",
  "00000001011111011101010000000000",
  "00000000101011101011100000000000",
  "00000001010101011111010000000000",
  "00000000101011111011100000000000",
  "00000001011101010101000000000000",
  "00000000101011111111100000000000",
  "00000001010101010111000000000000",
  "00000010111010101010100000000000",
  "00000001010101110111000000000000",
  "00000010101110101010100000000000",
  "00000001010101010101000000000000",
  "00000010101010101011100000000000",
  "00000101010100000000100000000000",
  "00000010000000000000010000000000",
  "00001000000000000000000000000000",
  "00010000000000000000000000000000",
  "00100000000000000000000000000000",
  "00000000000000000000000000000000",
  "10000000000000000000000000000000",
];

/** Cube edge pitch in world units (one mask cell). */
export const U = 0.21;
/** Width/height of the mask in world units. */
export const MARK_SIZE = 32 * U;

const CX = 15; // centre of mass, cell units
const CY = 16;
const DZ = 5; // max extra depth layers
const RR = 23; // radius over which depth fades out
const SPINE = 4; // front and back point length

// Ordered Bayer-like hash, same as the POC.
function b2(x: number, y: number) {
  x = Math.floor(x);
  y = Math.floor(y);
  const v = x / 2 + y * y * 0.75;
  return v - Math.floor(v);
}
function b4(x: number, y: number) {
  return b2(x * 0.5, y * 0.5) * 0.25 + b2(x, y);
}
function b8(x: number, y: number) {
  return b4(x * 0.5, y * 0.5) * 0.25 + b2(x, y);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface MarkData {
  count: number;
  /** Number of cubes on the front plane (always 173). */
  frontCount: number;
  /** xyz per cube: locked position in mark space (mark centred on origin, front plane at z = 0). */
  target: Float32Array;
  /** xyz per cube: spawn position outside the frame, along the cube's own target direction with jitter. */
  spawn: Float32Array;
  /** xyz per cube: initial tumble angles. */
  rot0: Float32Array;
  /** xy per cube: tumble speeds (rad/s) while in flight. */
  spin: Float32Array;
  /** Swirl angle (rad) around the mark axis at the start of flight. */
  swirl: Float32Array;
  /** 0..1 arrival stagger. */
  delay: Float32Array;
  /** xyz per cube: tiny permanent tilt (at most ~2 degrees) once locked. */
  tilt: Float32Array;
  /** Per-cube brightness multiplier (0.8..1.08), so landed faces tile but still differ in tone. */
  shade: Float32Array;
  /** 0..2PI phase for the idle shimmer. */
  phase: Float32Array;
}

const cache: Partial<Record<Quality, MarkData>> = {};

export function getMarkData(quality: Quality = "high"): MarkData {
  const hit = cache[quality];
  if (hit) return hit;

  const low = quality === "low";
  const T: number[] = [];
  const add = (c: number, r: number, k: number) => {
    T.push((c - 15.5) * U, -(r - 15.5) * U, k * U);
  };

  let frontCount = 0;
  for (let r = 0; r < 32; r++) {
    for (let c = 0; c < 32; c++) {
      if (MASK_ROWS[r].charAt(c) !== "1") continue;
      add(c, r, 0);
      frontCount++;
      const g = Math.min(1, Math.max(0, (c - r + 14) / 36));
      const d = Math.hypot(c - CX, r - CY);
      const f = Math.max(0, 1 - d / RR);
      let zb = Math.round(DZ * Math.pow(f, 1.3) * (0.2 + 0.8 * g) + 0.3);
      // Low quality: one layer of volume at most, and thinner.
      if (low) zb = Math.min(zb, 1);
      const dens = (0.3 + 0.7 * g) * (low ? 0.8 : 1);
      for (let k = 1; k <= zb; k++) {
        if (b8(c + 7 * k, r + 3 * k) < dens) add(c, r, k);
        if (b8(c + 7 * k + 11, r + 3 * k + 5) < dens) add(c, r, -k);
      }
    }
  }
  const spine = low ? 2 : SPINE;
  for (let k = 1; k <= spine; k++) {
    const reach = k <= 2 ? 1 : 0;
    for (let dy = -reach; dy <= reach; dy++) {
      for (let dx = -reach; dx <= reach; dx++) {
        if (Math.abs(dx) + Math.abs(dy) > reach) continue;
        add(CX + dx, CY + dy, k);
        add(CX + dx, CY + dy, -k);
      }
    }
  }

  const count = T.length / 3;
  const target = new Float32Array(T);
  const spawn = new Float32Array(count * 3);
  const rot0 = new Float32Array(count * 3);
  const spin = new Float32Array(count * 2);
  const swirl = new Float32Array(count);
  const delay = new Float32Array(count);
  const tilt = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const shade = new Float32Array(count);

  const rnd = mulberry32(0x58504c59);
  for (let i = 0; i < count; i++) {
    const tx = target[i * 3];
    const ty = target[i * 3 + 1];
    const ang = Math.atan2(ty, tx || 0.001) + (rnd() - 0.5) * 1.8;
    const rad = 17 + rnd() * 9;
    spawn[i * 3] = Math.cos(ang) * rad;
    spawn[i * 3 + 1] = Math.sin(ang) * rad;
    spawn[i * 3 + 2] = (rnd() - 0.5) * 10;
    rot0[i * 3] = rnd() * 6.2832;
    rot0[i * 3 + 1] = rnd() * 6.2832;
    rot0[i * 3 + 2] = rnd() * 6.2832;
    spin[i * 2] = (rnd() - 0.5) * 1.2;
    spin[i * 2 + 1] = (rnd() - 0.5) * 1.2;
    swirl[i] = 0.8 + rnd() * 0.9;
    delay[i] = rnd();
    tilt[i * 3] = (rnd() - 0.5) * 0.07;
    tilt[i * 3 + 1] = (rnd() - 0.5) * 0.07;
    tilt[i * 3 + 2] = (rnd() - 0.5) * 0.03;
    shade[i] = 0.8 + rnd() * 0.28;
    phase[i] = rnd() * 6.2832;
  }

  const out: MarkData = { count, frontCount, target, spawn, rot0, spin, swirl, delay, tilt, phase, shade };
  cache[quality] = out;
  return out;
}
