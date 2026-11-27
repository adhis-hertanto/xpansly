import { glslColours } from "./palette";
import type { Scene } from "./scenes";

/*
 * The Xpansly Visual Generator's Planet and Wave modes as a fragment shader, compiled per scene
 * (see scenes.ts): glow field with OKLab colour ramps, rim, mesh veil, optional Solar Pulse lines,
 * optional pill or pixel dither, and grain. On top of the still:
 * - the light swings round the horizon to follow the pointer, breathing gently when idle;
 * - hovering thickens the rim and puts a flare where the pointer points;
 * - pixels of the dither swell and light up around the pointer and twinkle slowly;
 * - greyscale silk folds drift behind the grain, outside the shape.
 * The canvas reproduces object-fit: cover over the scene's poster so it lines up with it.
 */
export const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const f = (n: number) => (Number.isInteger(n) ? `${n}.0` : `${n}`);
const v2 = (a: number, b: number) => `vec2(${f(a)}, ${f(b)})`;

export function fragSource(sc: Scene) {
  const mesh = sc.blobs
    .map(([x, y, r, c, s]) => {
      const k = 1 / (2 * Math.pow(r * 0.55, 2));
      return `  { vec2 q = uv - ${v2(x, y)}; mesh += exp(-dot(q, q) * ${f(k)}) * ${f(s)} * M${c.toUpperCase()}; }`;
    })
    .join("\n");
  const d = sc.dither;
  const toShape = sc.box.flip
    ? `return ${v2(1, sc.box.asp)} - ((css - uImg.xy) / uImg.z - ${v2(sc.box.BX, sc.box.BY)}) / S;`
    : `return ((css - uImg.xy) / uImg.z - ${v2(sc.box.BX, sc.box.BY)}) / S;`;
  const dist = sc.mode === "wave" ? "R - length(p)" : "length(p) - R";

  return `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uRes;      // drawing buffer px
uniform float uScale;   // buffer px per CSS px
uniform vec3 uImg;      // cover-fitted poster: left, top, width (CSS px)
uniform float uTime;    // seconds
uniform float uLight;   // light angle, degrees
uniform float uGlow;
uniform float uHover;   // 0..1, mouse over the art
uniform vec3 uPtr;      // pointer in shape space + presence 0..1
uniform sampler2D uLut;
out vec4 outColor;
${glslColours(sc.colourway)}
const float S = ${f(sc.box.S)}, REF = ${f(sc.ref)};
const vec2 C = ${v2(sc.C[0], sc.C[1])};
const float R = ${f(sc.R)}, SPREAD = ${f(sc.spread)}, RIM_SPREAD = ${f(sc.rimSpread)};
const float RIM = ${f(sc.rim)}, RIMGLOW = ${f(sc.rimGlow)}, FADE = ${f(sc.fade)}, SOFT0 = ${f(sc.soft0)}, INNER_R = ${f(sc.innerR)};
const float DGAM = ${f(sc.dgam)}, MESHS = ${f(sc.meshS)}, GRAIN = ${f(sc.grain)}, SILK = ${f(sc.silk)};
const float BASE_LIGHT = ${f(sc.light)}, HWN = 0.0010526;

float ss(float a, float b, float x){ float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
float sg(float x){ return 1.0 / (1.0 + exp(-clamp(x, -60.0, 60.0))); }
vec3 toLin(vec3 c){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 toSrgb(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
vec3 lut(float row, float t){ return toLin(texture(uLut, vec2((clamp(t, 0.0, 1.0) * 255.0 + 0.5) / 256.0, (row + 0.5) / 3.0)).rgb); }

uvec4 pcg4(uvec4 v){
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
  v ^= v >> 16u;
  v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
  return v;
}
vec4 hash4(vec2 cell, float s){ return vec4(pcg4(uvec4(ivec4(cell, s, 7)))) / 4294967295.0; }

// CSS px -> generator shape space.
vec2 toShape(vec2 css){ ${toShape} }

// Signed distance to the shape edge (positive on the glow side) and the angle from the light.
float edge(vec2 uv, out float dth){
  vec2 p = uv - C;
  dth = mod(degrees(atan(-p.y, p.x)) - uLight + 180.0, 360.0) - 180.0;
  return ${dist};
}

float glowField(float out_, float ang2){
  float f0 = (exp(-out_ / uGlow) * 0.62 + exp(-out_ / (uGlow * 0.3)) * 0.22) * (0.38 + 0.62 * ang2);
  return pow(f0 / 0.84, DGAM) * 0.84;
}

// The light value the generator hands to its dither pass (F).
float lightF(vec2 uv){
  float dth; float d = edge(uv, dth);
  float a = dth / SPREAD, a2 = a / 1.8;
  float ang = exp(-a * a), ang2 = exp(-a2 * a2);
  float field = glowField(max(d, 0.0), ang2);
  float soft = SOFT0 + FADE * pow(1.0 - ang, 1.6) * (0.4 + 0.6 * ss(0.0, 0.5, ${sc.softAxis}));
  float sm = sg(d / soft);
  float rl = exp(-(d / RIM) * (d / RIM)) * (0.1 + 0.9 * pow(ang, 1.3)) * (1.0 - 0.65 * min(1.0, soft / (SOFT0 + FADE)));
  float bg = exp(-abs(d) / RIMGLOW) * (0.05 + 0.95 * ang) * 0.4;
  return min(1.0, max(0.0, field) * sm * 1.15 + rl * 0.6 + bg * 0.3);
}

// Pointer lift at a point in shape space.
float lift(vec2 uv){ vec2 dp = uv - uPtr.xy; return uPtr.z * exp(-dot(dp, dp) / 0.012); }

float bayer8(ivec2 c){
  int v = 0;
  for (int i = 0; i < 3; i++) {
    int yb = (c.y >> (2 - i)) & 1, xb = (c.x >> (2 - i)) & 1;
    v = v * 4 + (yb == 0 ? (xb == 0 ? 0 : 2) : (xb == 0 ? 3 : 1));
  }
  return float(v);
}

// Grain: bilinear value noise over unit-variance lattice samples (static).
vec4 grain(vec2 px){
  vec2 i = floor(px), fr = px - i; fr = fr * fr * (3.0 - 2.0 * fr);
  vec4 a = hash4(i, 7.0), b = hash4(i + vec2(1, 0), 7.0), c = hash4(i + vec2(0, 1), 7.0), e = hash4(i + vec2(1, 1), 7.0);
  vec4 h = mix(mix(a, b, fr.x), mix(c, e, fr.x), fr.y);
  return vec4((h.x + h.y - 1.0) * 2.9, (h.z - 0.5) * 4.2, (h.w - 0.5) * 4.2, (fract(h.x * 91.7) - 0.5) * 4.2);
}

float vh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), fr = fract(p); fr = fr * fr * (3.0 - 2.0 * fr);
  return mix(mix(vh(i), vh(i + vec2(1, 0)), fr.x), mix(vh(i + vec2(0, 1)), vh(i + vec2(1, 1)), fr.x), fr.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
${
  sc.lines
    ? `
// Solar Pulse geometry, fixed to the resting light: circles tangent at the lit point plus a chain of small circles.
float pulseLines(vec2 uv, float pnN){
  float g = radians(BASE_LIGHT);
  vec2 fa = vec2(-cos(g), sin(g));
  vec2 x = (uv - C) / R;
  float q = dot(x, fa), pp = x.y * fa.x - x.x * fa.y;
  if (length(vec2(pp, q)) > 1.03) return 0.0;
  float md = 1e9, rc = 1.0 / 7.0;
  for (int k = 1; k <= 6; k++) {
    float rk = float(k) / 7.0;
    md = min(md, abs(length(vec2(pp, q + 1.0 - rk)) - rk));
    md = min(md, abs(length(vec2(pp, q + 1.0 - float(2 * k + 1) * rc)) - rc));
  }
  return clamp((HWN - md) / pnN + 0.5, 0.0, 1.0);
}`
    : ""
}

void main(){
  vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  vec2 uv = toShape(css);
  float refPx = uImg.z * REF / 760.0;     // CSS px per generator preview px

  float dth; float d = edge(uv, dth);
  float a = dth / SPREAD, a2 = a / 1.8;
  float ang = exp(-a * a), ang2 = exp(-a2 * a2);
  float ins = max(-d, 0.0);
  float field = glowField(max(d, 0.0), ang2);
  float hue = pow(clamp(0.5 + 0.62 * sin(radians(dth)), 0.0, 1.0), 1.4);
  vec3 c0 = mix(lut(0.0, field), lut(1.0, field), hue);
  float inner = exp(-ins / INNER_R) * 0.10 * (0.2 + 0.8 * ang);
  float ar = dth / RIM_SPREAD, angR = exp(-ar * ar);
  float soft = SOFT0 + FADE * pow(1.0 - angR, 1.6) * (0.4 + 0.6 * ss(0.0, 0.5, ${sc.softAxis}));
  float sm = sg(d / soft);
  vec3 col = mix(lut(2.0, inner * 4.0), c0, sm);
${
  sc.lines
    ? `
  // Geometry lines, lit by the resting light so they stay fixed while the light moves.
  float cov = pulseLines(uv, 1.0 / (uImg.z * S * uScale) / R) * (d <= 0.0 ? 1.0 : exp(-d / 0.0405));
  if (cov > 0.0) {
    vec2 p0 = uv - C;
    float b0 = (mod(degrees(atan(-p0.y, p0.x)) - BASE_LIGHT + 180.0, 360.0) - 180.0) / (SPREAD * 1.8);
    float llf = exp(-abs(d) / 0.3275) * (0.35 + 0.65 * exp(-b0 * b0));
    float t = ss(0.38, 0.72, (col.r + col.g + col.b) / 3.0);
    float al = min(1.0, cov * 0.45 * (0.3 + 0.7 * llf) * (1.0 + 0.6 * t));
    col = mix(col, mix(vec3(1.0), LAD, t), al);
  }`
    : ""
}

  // Rim outline over a wide arc; under hover it thickens and brightens at the light.
  float rimW = RIM * (1.0 + 0.8 * uHover * ang);
  float rl = exp(-(d / rimW) * (d / rimW)) * (0.1 + 0.9 * pow(angR, 1.1)) * (1.0 - 0.65 * min(1.0, soft / (SOFT0 + FADE))) * (1.0 + 0.6 * uHover);
  float bg = exp(-abs(d) / (RIMGLOW * (1.0 + 0.5 * uHover))) * (0.05 + 0.95 * angR) * 0.4 * (1.0 + 0.5 * uHover);
  col += rl * RIMC * 0.95 + bg * BLC * 0.30;
  // Hover flare: a hot spot on the rim where the pointer points.
  float fa = dth / 16.0;
  float flare = uHover * exp(-fa * fa) * (exp(-(d / (RIM * 1.8)) * (d / (RIM * 1.8))) * 1.4 + exp(-abs(d) / 0.06) * 0.35);
  col += flare * mix(RIMC, vec3(1.0), 0.5);

  // Silk: greyscale ShaderGradient-style folds drifting on their own, behind the grain, off the shape.
  float sr = radians(50.0);
  vec2 sp = mat2(cos(sr), sin(sr), -sin(sr), cos(sr)) * ((css - uImg.xy) / uImg.z);
  float st = uTime * 0.4 * 0.6;
  float warp = fbm(sp * 1.3 + vec2(st * 0.5, -st * 0.3)) * 2.0 - 1.0;
  float band = 0.5 + 0.5 * sin(sp.x * 5.5 * 2.2 + warp * 4.0 * 0.6 + st);
  float silk = (band * 0.25 + pow(band, 5.0) * 0.75) * (0.55 + 0.45 * fbm(sp * 0.7 - st * 0.15));
  col += vec3(silk * SILK) * sm;

  // Mesh veil.
  float mk = (0.8 + 0.2 * (1.0 - sm)) * 0.9;
  vec3 mesh = vec3(0.0);
${mesh}
  col += mesh * MESHS * mk;
  col = 1.0 - exp(-col * 1.05);

  // Film grain, weighted towards the mid tones as in the generator.
  vec3 s = toSrgb(col);
  float lum = (s.r + s.g + s.b) / 3.0;
  float wt = 0.30 + 1.6 * sqrt(lum) * (1.0 - lum * 0.55);
  vec4 gn = grain(css * uScale / max(1.0, refPx * uScale));
  s += (gn.x * 0.055 + gn.yzw * 0.012) * wt * GRAIN;
${
  d
    ? `
  // ${d.style === "pix" ? "Pixel" : "Pill"} dither on the lit band. Pixels near the pointer swell and light up; all twinkle slowly.
  float cs = ${f(d.cell)} * refPx;
  vec2 cp = (css - uImg.xy) / cs;
  vec2 cell = floor(cp);
  vec4 h = hash4(cell, 11.0);
  if (h.x >= ${f(d.brk / 100)} * 0.22) {
    vec2 o = uImg.xy;
    float F = 0.25 * (lightF(toShape(o + (cell + vec2(0.25, 0.25)) * cs)) + lightF(toShape(o + (cell + vec2(0.75, 0.25)) * cs))
                    + lightF(toShape(o + (cell + vec2(0.25, 0.75)) * cs)) + lightF(toShape(o + (cell + vec2(0.75, 0.75)) * cs)));
    vec2 cuv = toShape(o + (cell + 0.5) * cs);
    vec2 cc = cell / 5.0, ci = floor(cc), cf = cc - ci; cf = cf * cf * (3.0 - 2.0 * cf);
    float cl = mix(mix(hash4(ci, 3.0).x, hash4(ci + vec2(1, 0), 3.0).x, cf.x), mix(hash4(ci + vec2(0, 1), 3.0).x, hash4(ci + vec2(1, 1), 3.0).x, cf.x), cf.y);
    cl = clamp((cl - 0.5) * 1.8 + 0.5, 0.0, 1.0);
    float br = ${f(d.brk / 100)};
    float b = pow(max(F, 0.0), ${f(Math.pow(2, (50 - d.con) / 25))}) * ${f(0.2 + (d.cov / 100) * 2.3)};
    b *= (1.0 - br) + br * ss(0.35, 0.72, cl) * 1.7;
    float l = lift(cuv);
    b = b * (1.0 + 2.5 * l) + 0.35 * l;
    b *= 0.85 + 0.3 * (0.5 + 0.5 * sin(uTime * 0.9 + h.y * 6.2832));
    if (b > (bayer8(ivec2(mod(cell, 8.0))) + 0.5) / 64.0) {
      float al = min(1.0, ${f(d.inten / 100)} * (0.55 + 0.45 * min(1.0, b)) * (1.0 + 0.6 * l));
      vec2 lp = (fract(cp) - 0.5) * cs;           // CSS px from the cell centre
${
  d.style === "pix"
    ? `      float half_ = cs * (0.36 + 0.1 * l);
      vec2 q2 = abs(lp) - half_;
      float pc = clamp(-max(q2.x, q2.y) * uScale + 0.5, 0.0, 1.0);`
    : `      vec2 sp2 = vec2(lp.x, lp.y - clamp(lp.y, -0.17 * cs, 0.17 * cs));
      float pc = clamp((max(0.5, cs * 0.055) - abs(length(sp2) - 0.23 * cs)) * uScale + 0.5, 0.0, 1.0);`
}
      s = mix(s, vec3(1.0), al * pc);
    }
  }`
    : ""
}
  outColor = vec4(clamp(s, 0.0, 1.0), 1.0);
}
`;
}
