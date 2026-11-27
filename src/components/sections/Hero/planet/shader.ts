import { glslColours, type Colourway } from "./palette";

/*
 * Planet mode of the Xpansly Visual Generator as a fragment shader, with the saved settings baked in:
 * dark theme, light -35, rim 30, fade 10, mesh 55, grain 55, space 70, Solar Pulse lines
 * (6, width 8, opacity 45, response 70, reach 20) and pill dither (cell 12, intensity 70,
 * coverage 55, breakup 35, contrast 50). Colourway and dither on/off are chosen at compile time.
 *
 * The hero art is that export rotated 180 degrees, placed so the shape box spans S image-widths
 * from (BX, BY). The canvas reproduces object-fit: cover over a 2880 x 1778 image, so it lines
 * up with the static poster underneath.
 *
 * Live additions on top of the still: the light swings round the horizon to follow the pointer
 * and breathes gently when idle. The line art and grain stay fixed.
 */
export const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

export const fragSource = (colourway: Colourway, dither: boolean) => `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uRes;      // drawing buffer px
uniform float uScale;   // buffer px per CSS px
uniform vec3 uImg;      // cover-fitted image: left, top, width (CSS px)
uniform float uTime;    // seconds
uniform float uSeed;    // grain frame
uniform float uLight;   // light angle, degrees
uniform float uLineAng; // geometry frame angle, degrees
uniform float uGlow;
uniform vec3 uPtr;      // pointer in shape space + presence 0..1
uniform vec4 uRip;      // ripple origin (shape space), age (s), strength
uniform sampler2D uLut;
out vec4 outColor;
${glslColours(colourway)}
#define DITHER ${dither ? 1 : 0}
const float S = 0.7146, BX = 0.3764, BY = 0.0243;
const vec2 C = vec2(0.3);
const float R = 0.5, SPREAD = 70.0, RIM = 0.003, RIMGLOW = 0.03, FADE = 0.10, SOFT0 = 0.0035;
const float DGAM = 4.2, MESHS = 0.0847, HWN = 0.0010526;

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

// CSS px -> shape space (u, v), undoing the 180 degree turn of the export.
vec2 toShape(vec2 css){ return 1.0 - ((css - uImg.xy) / uImg.z - vec2(BX, BY)) / S; }

float glowField(float out_, float ang2){
  float f0 = (exp(-out_ / uGlow) * 0.62 + exp(-out_ / (uGlow * 0.3)) * 0.22) * (0.38 + 0.62 * ang2);
  return pow(f0 / 0.84, DGAM) * 0.84;
}

// The light value the generator hands to its dither pass (F).
float lightF(vec2 uv){
  vec2 p = uv - C; float d = length(p) - R;
  float dth = mod(degrees(atan(-p.y, p.x)) - uLight + 180.0, 360.0) - 180.0;
  float a = dth / SPREAD, a2 = a / 1.8;
  float ang = exp(-a * a), ang2 = exp(-a2 * a2);
  float field = glowField(max(d, 0.0), ang2);
  float soft = SOFT0 + FADE * pow(1.0 - ang, 1.6) * (0.4 + 0.6 * ss(0.0, 0.5, uv.y));
  float sm = sg(d / soft);
  float rl = exp(-(d / RIM) * (d / RIM)) * (0.1 + 0.9 * pow(ang, 1.3)) * (1.0 - 0.65 * min(1.0, soft / (SOFT0 + FADE)));
  float bg = exp(-abs(d) / RIMGLOW) * (0.05 + 0.95 * ang) * 0.4;
  return min(1.0, max(0.0, field) * sm * 1.15 + rl * 0.6 + bg * 0.3);
}

// Pointer and ripple lift at a point in shape space.
float lift(vec2 uv){
  vec2 dp = uv - uPtr.xy;
  float l = uPtr.z * exp(-dot(dp, dp) / 0.012);
  float rr = length(uv - uRip.xy) - uRip.z * 0.38;
  l += uRip.w * exp(-(rr / 0.035) * (rr / 0.035)) * exp(-uRip.z * 1.3);
  return l;
}

// Solar Pulse geometry: circles tangent at the lit point plus a chain of small circles on the axis.
float pulseLines(vec2 uv, float pnN, out float q){
  float g = radians(uLineAng);
  vec2 fa = vec2(-cos(g), sin(g));
  vec2 x = (uv - C) / R;
  q = dot(x, fa);
  float pp = x.y * fa.x - x.x * fa.y;
  if (length(vec2(pp, q)) > 1.03) return 0.0;
  float md = 1e9, rc = 1.0 / 7.0;
  for (int k = 1; k <= 6; k++) {
    float rk = float(k) / 7.0;
    md = min(md, abs(length(vec2(pp, q + 1.0 - rk)) - rk));
    md = min(md, abs(length(vec2(pp, q + 1.0 - float(2 * k + 1) * rc)) - rc));
  }
  return clamp((HWN - md) / pnN + 0.5, 0.0, 1.0);
}

float bayer8(ivec2 c){
  int v = 0;
  for (int i = 0; i < 3; i++) {
    int yb = (c.y >> (2 - i)) & 1, xb = (c.x >> (2 - i)) & 1;
    int qd = yb == 0 ? (xb == 0 ? 0 : 2) : (xb == 0 ? 3 : 1);
    v = v * 4 + qd;
  }
  return float(v);
}

// Grain: bilinear value noise over unit-variance lattice samples, re-seeded each grain frame.
vec4 grain(vec2 px){
  vec2 i = floor(px), f = px - i; f = f * f * (3.0 - 2.0 * f);
  vec4 a = hash4(i, uSeed), b = hash4(i + vec2(1, 0), uSeed), c = hash4(i + vec2(0, 1), uSeed), d = hash4(i + vec2(1, 1), uSeed);
  vec4 h = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  // x+y: triangular, z/w: uniform. Rescaled to roughly unit RMS after interpolation.
  return vec4((h.x + h.y - 1.0) * 2.9, (h.z - 0.5) * 4.2, (h.w - 0.5) * 4.2, (fract(h.x * 91.7) - 0.5) * 4.2);
}

void main(){
  vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  vec2 uv = toShape(css);
  float shapePx = uImg.z * S;            // shape box size in CSS px
  float pn = 1.0 / (shapePx * uScale);   // one buffer px in shape units

  vec2 p = uv - C; float d = length(p) - R;
  float dth = mod(degrees(atan(-p.y, p.x)) - uLight + 180.0, 360.0) - 180.0;
  float a = dth / SPREAD, a2 = a / 1.8;
  float ang = exp(-a * a), ang2 = exp(-a2 * a2);
  float ins = max(-d, 0.0);
  float field = glowField(max(d, 0.0), ang2);
  float hue = pow(clamp(0.5 + 0.62 * sin(radians(dth)), 0.0, 1.0), 1.4);
  vec3 c0 = mix(lut(0.0, field), lut(1.0, field), hue);
  float inner = exp(-ins / (R * 0.16)) * 0.10 * (0.2 + 0.8 * ang);
  float soft = SOFT0 + FADE * pow(1.0 - ang, 1.6) * (0.4 + 0.6 * ss(0.0, 0.5, uv.y));
  float sm = sg(d / soft);
  vec3 col = mix(lut(2.0, inner * 4.0), c0, sm);

  // Geometry lines, inside the planet and fading out past the rim.
  float q;
  float cov = pulseLines(uv, pn / R, q) * (d <= 0.0 ? 1.0 : exp(-d / 0.0405));
  if (cov > 0.0) {
    // Lit by the resting light, not the live one, so the line art stays fixed while the light moves.
    float b0 = (mod(degrees(atan(-p.y, p.x)) - uLineAng + 180.0, 360.0) - 180.0) / (SPREAD * 1.8);
    float llf = exp(-abs(d) / 0.3275) * (0.35 + 0.65 * exp(-b0 * b0));
    float al = cov * 0.45 * (0.3 + 0.7 * llf);
    float t = ss(0.38, 0.72, (col.r + col.g + col.b) / 3.0);
    al = min(1.0, al * (1.0 + 0.6 * t));
    col = mix(col, mix(vec3(1.0), LAD, t), al);
  }

  float rl = exp(-(d / RIM) * (d / RIM)) * (0.1 + 0.9 * pow(ang, 1.3)) * (1.0 - 0.65 * min(1.0, soft / (SOFT0 + FADE)));
  float bg = exp(-abs(d) / RIMGLOW) * (0.05 + 0.95 * ang) * 0.4;
  col += rl * RIMC * 0.95 + bg * BLC * 0.30;

  // Mesh veil: five soft colour blobs.
  float mk = (0.8 + 0.2 * (1.0 - sm)) * 0.9;
  vec3 mesh = vec3(0.0);
  vec2 q1 = uv - vec2(0.10, 0.92), q2 = uv - vec2(0.40, 1.02), q3 = uv - vec2(0.95, 0.80), q4 = uv - vec2(0.92, 0.02), q5 = uv - vec2(0.60, 0.50);
  mesh += exp(-dot(q1, q1) * 9.370) * 0.50 * MH;
  mesh += exp(-dot(q2, q2) * 8.162) * 0.55 * MH;
  mesh += exp(-dot(q3, q3) * 8.162) * 0.50 * MA;
  mesh += exp(-dot(q4, q4) * 18.365) * 0.40 * MB;
  mesh += exp(-dot(q5, q5) * 10.331) * 0.18 * MH;
  col += mesh * MESHS * mk;
  col = 1.0 - exp(-col * 1.05);

  // Film grain, weighted towards the mid tones as in the generator.
  vec3 s = toSrgb(col);
  float lum = (s.r + s.g + s.b) / 3.0;
  float wt = 0.30 + 1.6 * sqrt(lum) * (1.0 - lum * 0.55);
  vec4 gn = grain(css * uScale / max(1.0, shapePx * uScale / 760.0));
  s += gn.x * 0.055 * wt + gn.yzw * 0.012 * wt;

  // Pill dither on the lit band, on a 12 px (at 760) grid.
#if DITHER
  float cs = 12.0 * shapePx / 760.0;
  vec2 cp = (css - uImg.xy) / cs;
  vec2 cell = floor(cp);
  vec4 h = hash4(cell, 11.0);
  if (h.x >= 0.35 * 0.22) {
    float f = 0.25 * (lightF(toShape(uImg.xy + (cell + vec2(0.25, 0.25)) * cs)) + lightF(toShape(uImg.xy + (cell + vec2(0.75, 0.25)) * cs))
                    + lightF(toShape(uImg.xy + (cell + vec2(0.25, 0.75)) * cs)) + lightF(toShape(uImg.xy + (cell + vec2(0.75, 0.75)) * cs)));
    vec2 cuv = toShape(uImg.xy + (cell + 0.5) * cs);
    // Breakup: slow clustered noise standing in for the generator's blurred random field.
    vec2 cc = cell / 5.0, ci = floor(cc), cf = cc - ci; cf = cf * cf * (3.0 - 2.0 * cf);
    float cl = mix(mix(hash4(ci, 3.0).x, hash4(ci + vec2(1, 0), 3.0).x, cf.x), mix(hash4(ci + vec2(0, 1), 3.0).x, hash4(ci + vec2(1, 1), 3.0).x, cf.x), cf.y);
    cl = clamp((cl - 0.5) * 1.8 + 0.5, 0.0, 1.0);
    float b = f * 1.465 * (0.65 + 0.35 * ss(0.35, 0.72, cl) * 1.7);
    b *= (1.0 + 1.4 * lift(cuv)) * (0.9 + 0.2 * sin(uTime * 1.1 + h.y * 6.2832));
    if (b > (bayer8(ivec2(mod(cell, 8.0))) + 0.5) / 64.0) {
      float al = 0.7 * (0.55 + 0.45 * min(1.0, b));
      vec2 lp = (fract(cp) - 0.5) * cs;                       // CSS px from the cell centre
      vec2 sp = vec2(lp.x, lp.y - clamp(lp.y, -0.17 * cs, 0.17 * cs));
      float dist = abs(length(sp) - 0.23 * cs);
      float hw = max(0.5, cs * 0.055);
      float pc = clamp((hw - dist) * uScale + 0.5, 0.0, 1.0);
      s = mix(s, vec3(1.0), al * pc);
    }
  }
#endif
  outColor = vec4(clamp(s, 0.0, 1.0), 1.0);
}
`;
