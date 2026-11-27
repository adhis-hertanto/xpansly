"use client";

import { useEffect, useRef } from "react";
import { buildLutBytes, type Colourway } from "./planet/palette";
import { fragSource, VERT } from "./planet/shader";
import styles from "./Hero.module.css";

/*
 * Live version of the hero planet art (see planet/shader.ts). It fades in over the static
 * poster once the first frame is drawn, and leaves the poster in place if WebGL2 is missing,
 * the context is lost, or the visitor prefers reduced motion (one still frame is drawn then).
 * Capped at 30fps and ~2.4M buffer pixels, paused off-screen and in hidden tabs.
 */

/** The poster art uses the Blue colourway with no pill dither; set "violet" / true for the saved generator settings. */
const COLOURWAY: Colourway = "blue";
const DITHER = false;

const IMG_W = 2880;
const IMG_H = 1778;
const SHAPE = { S: 0.7146, BX: 0.3764, BY: 0.0243, cx: 0.3, cy: 0.3 };
const BASE_LIGHT = -35;
const FRAME_MS = 1000 / 30;
const MAX_PX = 2.4e6;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

export function HeroPlanet() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, fragSource(COLOURWAY, DITHER)));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (e) {
      console.warn("Hero planet disabled:", e);
      return;
    }
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 3, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildLutBytes(COLOURWAY));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("uRes"), scale: u("uScale"), img: u("uImg"), time: u("uTime"), seed: u("uSeed"), light: u("uLight"),
      lineAng: u("uLineAng"), glow: u("uGlow"), ptr: u("uPtr"), rip: u("uRip"), lut: u("uLut"),
    };
    gl.uniform1i(U.lut, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1200px)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    // Layout: CSS size of the canvas and the cover-fitted image box inside it.
    let cw = 0, ch = 0, scale = 1, imgL = 0, imgT = 0, imgW = 1;
    const layout = () => {
      cw = canvas.clientWidth;
      ch = canvas.clientHeight;
      if (!cw || !ch) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      scale = Math.min(dpr, Math.sqrt(MAX_PX / (cw * ch)));
      canvas.width = Math.round(cw * scale);
      canvas.height = Math.round(ch * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const k = Math.max(cw / IMG_W, ch / IMG_H);
      imgW = IMG_W * k;
      const [px, py] = desktop.matches ? [0.5, 0.5] : [0.78, 0.3]; // matches .bgImg object-position
      imgL = (cw - imgW) * px;
      imgT = (ch - IMG_H * k) * py;
      return true;
    };
    const toShape = (x: number, y: number) => [
      1 - ((x - imgL) / imgW - SHAPE.BX) / SHAPE.S,
      1 - ((y - imgT) / imgW - SHAPE.BY) / SHAPE.S,
    ];

    // Interaction state, eased each frame.
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, amt: 0, target: 0 };
    const rip = { x: 0, y: 0, t0: -100, str: 0 };
    let light = BASE_LIGHT;
    const t0 = performance.now();

    const draw = (now: number) => {
      const t = reduced ? 0 : (now - t0) / 1000;
      if (!fine.matches && !reduced) {
        // No hover on touch: a slow light drifts around the lit side of the rim instead.
        const a = ((BASE_LIGHT + 180 + 28 * Math.sin(t * 0.17)) * Math.PI) / 180;
        const r = 0.52 + 0.04 * Math.sin(t * 0.29);
        [ptr.tx, ptr.ty] = [SHAPE.cx + r * Math.cos(a) * -1, SHAPE.cy + r * Math.sin(a)];
        ptr.target = 0.55;
      }
      ptr.x += (ptr.tx - ptr.x) * 0.12;
      ptr.y += (ptr.ty - ptr.y) * 0.12;
      ptr.amt += (ptr.target - ptr.amt) * 0.06;
      // The light leans towards the pointer (within +-40 degrees) and breathes slowly.
      const pa = (Math.atan2(-(ptr.y - SHAPE.cy), ptr.x - SHAPE.cx) * 180) / Math.PI;
      const delta = ((((pa - BASE_LIGHT + 180) % 360) + 360) % 360) - 180;
      const goal = BASE_LIGHT + 5 * Math.sin(t * 0.11) + Math.max(-40, Math.min(40, delta)) * 0.45 * ptr.amt;
      light += (goal - light) * 0.08;

      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.scale, scale);
      gl.uniform3f(U.img, imgL, imgT, imgW);
      gl.uniform1f(U.time, t);
      gl.uniform1f(U.seed, reduced ? 7 : Math.floor(t * 12));
      gl.uniform1f(U.light, light);
      gl.uniform1f(U.lineAng, BASE_LIGHT + (light - BASE_LIGHT) * 0.5);
      gl.uniform1f(U.glow, 0.55 * (1 + 0.035 * (Math.sin(t * 0.23) - 1)) + 0.03 * ptr.amt);
      gl.uniform3f(U.ptr, ptr.x, ptr.y, ptr.amt);
      gl.uniform4f(U.rip, rip.x, rip.y, (now - rip.t0) / 1000, rip.str);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0, last = 0, inView = false, shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      canvas.dataset.ready = "true";
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now);
      show();
    };
    const start = () => {
      if (reduced || raf || !inView || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const still = () => {
      if (!layout()) return;
      draw(performance.now());
      show();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = canvas.getBoundingClientRect();
      [ptr.tx, ptr.ty] = toShape(e.clientX - r.left, e.clientY - r.top);
      if (ptr.amt < 0.01) [ptr.x, ptr.y] = [ptr.tx, ptr.ty];
      ptr.target = 1;
    };
    const onLeave = () => (ptr.target = 0);
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a, button, input, select, textarea, label")) return;
      const r = canvas.getBoundingClientRect();
      [rip.x, rip.y] = toShape(e.clientX - r.left, e.clientY - r.top);
      rip.t0 = performance.now();
      rip.str = 1;
    };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => (reduced ? still() : layout()), shown ? 120 : 0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      delete canvas.dataset.ready;
    };
    canvas.addEventListener("webglcontextlost", onLost);
    if (!reduced) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      section.addEventListener("pointerdown", onDown);
    }
    if (reduced) still();
    else layout();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={styles.planet} aria-hidden="true" />;
}
