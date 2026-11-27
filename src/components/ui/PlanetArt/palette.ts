/*
 * Colour maths ported from the Xpansly Visual Generator (dark theme).
 * Gradients are blended in OKLab and baked into a 256 x 3 lookup texture (sRGB-encoded bytes):
 * row 0 = cool glow, row 1 = warm glow, row 2 = planet body.
 */
type RGB = [number, number, number];

const hx = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16) / 255) as RGB;
const sc = (a: RGB, k: number): RGB => a.map((v) => v * k) as RGB;
const add = (a: RGB, b: RGB): RGB => a.map((v, i) => v + b[i]) as RGB;
const s2l = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const l2s = (c: number) => {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
};
const pw = (c: RGB): RGB => c.map((v) => Math.pow(v, 2.2)) as RGB;

function lab(rgb: RGB): RGB {
  const [r, g, b] = rgb.map(s2l);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function lin(L: RGB): RGB {
  const l = Math.pow(L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2], 3);
  const m = Math.pow(L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2], 3);
  const s = Math.pow(L[0] - 0.0894841775 * L[1] - 1.291485548 * L[2], 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
/** 256 linear-RGB samples of an OKLab gradient with smoothstepped segments. */
function lut(stops: Array<[number, RGB]>): RGB[] {
  const labs = stops.map((s) => lab(s[1]));
  const out: RGB[] = [];
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let k = 0;
    while (k < stops.length - 2 && t >= stops[k + 1][0]) k++;
    let f = (t - stops[k][0]) / (stops[k + 1][0] - stops[k][0]);
    f = Math.max(0, Math.min(1, f));
    f = f * f * (3 - 2 * f);
    out.push(lin([0, 1, 2].map((j) => labs[k][j] * (1 - f) + labs[k + 1][j] * f) as RGB));
  }
  return out;
}

const BLACK = hx("#0A0A0A");
const BLUE = hx("#0052D4");
const PURPLE = hx("#7303C0");
const VIOLET = hx("#EC38BC");
const CYAN = hx("#9CECFB");
const OR = hx("#E65C00");
const RED = hx("#E52D27");
const LIL = hx("#A895F2");
const LIL2 = hx("#B9A4F6");

type Stops = Array<[number, RGB]>;
type Palette = { cool: Stops; warm: Stops; mesh: { a: RGB; b: RGB; h: RGB }; rim: string };
export type Colourway = "violet" | "blue" | "ember";

/** The generator's colourways used on the site. */
const PALETTES: Record<Colourway, Palette> = {
  violet: {
    cool: [[0, BLACK], [0.1, add(sc(BLUE, 0.45), sc(PURPLE, 0.25))], [0.34, add(sc(BLUE, 0.8), sc(PURPLE, 0.2))], [0.58, add(sc(BLUE, 0.45), sc(LIL, 0.55))], [0.8, LIL], [1, hx("#CFC6FF")]],
    warm: [[0, BLACK], [0.1, sc(PURPLE, 0.55)], [0.34, add(sc(PURPLE, 0.85), sc(VIOLET, 0.15))], [0.55, add(sc(VIOLET, 0.55), sc(LIL, 0.45))], [0.78, LIL2], [1, hx("#D9CCFF")]],
    mesh: { a: hx("#2F6FE0"), b: hx("#E0709F"), h: hx("#8C6CF2") },
    rim: "#FFD9F6",
  },
  blue: {
    cool: [[0, BLACK], [0.1, sc(BLUE, 0.35)], [0.34, sc(BLUE, 0.85)], [0.6, add(sc(BLUE, 0.4), sc(CYAN, 0.6))], [0.82, CYAN], [1, hx("#F2FDFF")]],
    warm: [[0, BLACK], [0.1, add(sc(BLUE, 0.3), sc(PURPLE, 0.2))], [0.34, sc(BLUE, 0.8)], [0.6, add(sc(BLUE, 0.5), sc(CYAN, 0.5))], [0.84, CYAN], [1, hx("#FFFFFF")]],
    mesh: { a: BLUE, b: hx("#5B8CFF"), h: CYAN },
    rim: "#E6FAFF",
  },
  ember: {
    cool: [[0, BLACK], [0.1, sc(OR, 0.3)], [0.34, sc(OR, 0.85)], [0.6, add(sc(OR, 0.5), sc(hx("#FFD2A8"), 0.5))], [0.82, hx("#FFD2A8")], [1, hx("#FFFFFF")]],
    warm: [[0, BLACK], [0.1, sc(OR, 0.25)], [0.34, add(sc(OR, 0.75), sc(RED, 0.2))], [0.6, add(sc(OR, 0.6), sc(hx("#FFB777"), 0.4))], [0.84, hx("#FFE3C4")], [1, hx("#FFFFFF")]],
    mesh: { a: OR, b: RED, h: hx("#FF9A4D") },
    rim: "#FFE6CF",
  },
};

export function buildLutBytes(name: Colourway): Uint8Array {
  const p = PALETTES[name];
  const rows = [lut(p.cool), lut(p.warm), lut([[0, BLACK], [0.45, sc(p.mesh.h, 0.2)], [1, sc(p.mesh.h, 0.5)]])];
  const bytes = new Uint8Array(256 * 3 * 4);
  rows.forEach((row, y) =>
    row.forEach((c, x) => {
      const o = (y * 256 + x) * 4;
      bytes[o] = Math.round(l2s(c[0]) * 255);
      bytes[o + 1] = Math.round(l2s(c[1]) * 255);
      bytes[o + 2] = Math.round(l2s(c[2]) * 255);
      bytes[o + 3] = 255;
    }),
  );
  return bytes;
}

/** Linear-light constants the shader needs, as GLSL vec3 literals. */
const v3 = (c: RGB) => `vec3(${c.map((v) => v.toFixed(5)).join(",")})`;
export function glslColours(name: Colourway): string {
  const { mesh: m, rim } = PALETTES[name];
  return `
const vec3 RIMC = ${v3(pw(hx(rim)))};
const vec3 BLC = ${v3(pw(add(sc(m.b, 0.5), sc(m.h, 0.5))))};
const vec3 LAD = ${v3(pw(sc(m.a, 0.55)))};
const vec3 MA = ${v3(pw(m.a))};
const vec3 MB = ${v3(pw(m.b))};
const vec3 MH = ${v3(pw(m.h))};
`;
}
