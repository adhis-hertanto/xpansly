"use client";

import { useEffect, useRef } from "react";
import { buildLutBytes } from "./palette";
import { fragSource, VERT } from "./shader";
import type { Scene } from "./scenes";

/*
 * Live version of a generator poster (see shader.ts). Lay it over the poster <img> with the same
 * box; it fades in once the first frame is drawn and leaves the poster in place without WebGL2,
 * on context loss, or for reduced motion (one still frame is drawn then).
 * Capped at 30fps and ~2.4M buffer pixels, paused off-screen and in hidden tabs.
 */

const FRAME_MS = 1000 / 30;
const MAX_PX = 2.4e6;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

export function PlanetCanvas({ scene, className }: { scene: Scene; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, fragSource(scene)));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (e) {
      console.warn("Planet art disabled:", e);
      return;
    }
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 3, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildLutBytes(scene.colourway));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("uRes"), scale: u("uScale"), img: u("uImg"), time: u("uTime"), light: u("uLight"),
      glow: u("uGlow"), hover: u("uHover"), ptr: u("uPtr"), lut: u("uLut"),
    };
    gl.uniform1i(U.lut, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1200px)");
    const { poster, box } = scene;

    // Layout: CSS size of the canvas and the cover-fitted poster box inside it.
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
      const k = Math.max(cw / poster.w, ch / poster.h);
      imgW = poster.w * k;
      const [px, py] = desktop.matches ? poster.posDesktop : poster.pos;
      imgL = (cw - imgW) * px;
      imgT = (ch - poster.h * k) * py;
      return true;
    };
    const toShape = (x: number, y: number): [number, number] => {
      const sx = ((x - imgL) / imgW - box.BX) / box.S;
      const sy = ((y - imgT) / imgW - box.BY) / box.S;
      return box.flip ? [1 - sx, box.asp - sy] : [sx, sy];
    };

    // Interaction state, eased each frame.
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, amt: 0, target: 0 };
    let light = scene.light;
    let mouseActive = false;
    let hover = 0;
    const t0 = performance.now();
    const mid = (scene.lightMin + scene.lightMax) / 2;
    const span = (scene.lightMax - scene.lightMin) / 2;

    const draw = (now: number) => {
      const t = reduced ? 0 : (now - t0) / 1000;
      if (!mouseActive && !reduced) {
        // No mouse over the art (touch, or idle): the light drifts slowly along the visible horizon.
        const a = ((mid + span * 0.6 * Math.sin(t * 0.17)) * Math.PI) / 180;
        const r = scene.R * 1.05;
        [ptr.tx, ptr.ty] = [scene.C[0] + r * Math.cos(a), scene.C[1] - r * Math.sin(a)];
        ptr.target = 0.55;
      }
      ptr.x += (ptr.tx - ptr.x) * 0.1;
      ptr.y += (ptr.ty - ptr.y) * 0.1;
      ptr.amt += (ptr.target - ptr.amt) * 0.1;
      hover += ((mouseActive ? 1 : 0) - hover) * 0.08;
      // The light follows the pointer round the horizon (within the scene's range) and breathes when idle.
      const pa = (Math.atan2(-(ptr.y - scene.C[1]), ptr.x - scene.C[0]) * 180) / Math.PI;
      const delta = ((((pa - scene.light + 180) % 360) + 360) % 360) - 180;
      const target = Math.max(scene.lightMin, Math.min(scene.lightMax, scene.light + delta));
      const goal = scene.light + 5 * Math.sin(t * 0.11) * (1 - ptr.amt) + (target - scene.light) * ptr.amt;
      light += (goal - light) * 0.14;

      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.scale, scale);
      gl.uniform3f(U.img, imgL, imgT, imgW);
      gl.uniform1f(U.time, t);
      gl.uniform1f(U.light, light);
      gl.uniform1f(U.glow, scene.glow * (1 + 0.035 * (Math.sin(t * 0.23) - 1)) + scene.glow * 0.13 * hover);
      gl.uniform1f(U.hover, hover);
      gl.uniform3f(U.ptr, ptr.x, ptr.y, hover);
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

    // Tracked on the window so overlaid content (nav, cards, forms) does not break the hover.
    const onLeave = () => {
      ptr.target = 0;
      mouseActive = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return onLeave();
      [ptr.tx, ptr.ty] = toShape(x, y);
      if (ptr.amt < 0.01) [ptr.x, ptr.y] = [ptr.tx, ptr.ty];
      ptr.target = 1;
      mouseActive = true;
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
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
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
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [scene]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
