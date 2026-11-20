"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  DoubleSide,
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  PointLight,
  Vector3,
  type Group,
  type PerspectiveCamera,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { U, getMarkData, type Quality } from "./markData";

export type MarkMaterial = "chrome" | "glass";
export type ProgressInput = number | MutableRefObject<number>;

export interface CubeMarkProps {
  /** Converge progress, 0 (all outside the frame) to 1 (locked into the mark). Number or ref (preferred). */
  progress: ProgressInput;
  material: MarkMaterial;
  quality: Quality;
  /** Multiplier for idle sway and shimmer once formed (0 freezes the mark straight on). Default 1. */
  idle?: number;
  /** Shifts the formed mark by a fraction of the visible width/height (e.g. [0.2, 0] moves it right). */
  offset?: readonly [number, number];
}

const TAU = Math.PI * 2;
const HOVER_RADIUS = 1.5;

const sm = (a: number, b: number, x: number) => {
  x = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

function makeChrome() {
  return new MeshPhysicalMaterial({
    color: new Color("#e9ebee"),
    metalness: 1,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
}

function makeGlass() {
  const m = new MeshPhysicalMaterial({
    color: new Color("#dfe6f2"),
    metalness: 0,
    roughness: 0.06,
    transparent: true,
    opacity: 0.32,
    ior: 1.5,
    specularIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    iridescence: 0,
    depthWrite: false,
    side: DoubleSide,
  });
  // Cheap fresnel: opaque-ish edges, clear-ish faces. No transmission pass.
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      /* glsl */ `
      float fresnelEdge = pow(1.0 - clamp(abs(dot(normalize(vNormal), normalize(vViewPosition))), 0.0, 1.0), 2.6);
      gl_FragColor.a = clamp(mix(diffuseColor.a, 1.0, fresnelEdge * 0.9), 0.0, 1.0);
      gl_FragColor.rgb *= mix(1.0, 1.6, fresnelEdge);
      #include <dithering_fragment>`,
    );
  };
  return m;
}

export function CubeMark({ progress, material, quality, idle = 1, offset }: CubeMarkProps) {
  const data = useMemo(() => getMarkData(quality), [quality]);
  const count = data.count;

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const idleRef = useRef(idle);
  idleRef.current = idle;
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  const group = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);
  const light = useRef<PointLight>(null);

  const geometry = useMemo(() => {
    const s = U * 0.94;
    return new RoundedBoxGeometry(s, s, s, 3, U * 0.15);
  }, []);
  const mat = useMemo(() => (material === "glass" ? makeGlass() : makeChrome()), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => mat.dispose(), [mat]);

  // Per-instance spring offsets (hover push), reset when the cube count changes.
  const off = useMemo(() => new Float32Array(count * 3), [count]);

  const scratch = useMemo(
    () => ({
      dummy: new Object3D(),
      local: new Vector3(),
      sp: 0,
      active: false,
      ndcX: 9,
      ndcY: 9,
      rotX: 0,
      rotY: 0,
      lightX: 0,
      lightY: 2,
    }),
    [],
  );

  const gl = useThree((s) => s.gl);

  // Window level pointer tracking: works under overlays, and with touch (pointer events).
  useEffect(() => {
    const canvas = gl.domElement;
    const s = scratch;
    const set = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        s.active = false;
        return;
      }
      s.ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
      s.ndcY = -(((e.clientY - r.top) / r.height) * 2 - 1);
      s.active = true;
    };
    const clear = () => {
      s.active = false;
    };
    window.addEventListener("pointermove", set, { passive: true });
    window.addEventListener("pointerdown", set, { passive: true });
    window.addEventListener("pointerup", clear, { passive: true });
    window.addEventListener("pointercancel", clear, { passive: true });
    document.documentElement.addEventListener("pointerleave", clear);
    return () => {
      window.removeEventListener("pointermove", set);
      window.removeEventListener("pointerdown", set);
      window.removeEventListener("pointerup", clear);
      window.removeEventListener("pointercancel", clear);
      document.documentElement.removeEventListener("pointerleave", clear);
    };
  }, [gl, scratch]);

  useFrame((state, delta) => {
    const m = mesh.current;
    const g = group.current;
    if (!m || !g) return;
    const s = scratch;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const input = progressRef.current;
    const target = typeof input === "number" ? input : input.current;
    s.sp = MathUtils.damp(s.sp, MathUtils.clamp(target, 0, 1), 6, dt);
    const sp = s.sp;
    m.visible = sp > 0.0005;
    if (light.current) light.current.visible = m.visible;
    if (!m.visible) return;

    const idleK = idleRef.current;
    const fin = sm(0.78, 1, sp);
    const cam = state.camera as PerspectiveCamera;
    const visH = 2 * cam.position.z * Math.tan(MathUtils.degToRad(cam.fov) / 2);
    const visW = visH * (state.size.width / state.size.height);

    // Group framing offset and sway.
    const o = offsetRef.current;
    g.position.x = o ? o[0] * visW : 0;
    g.position.y = o ? o[1] * visH : 0;
    const swayY = s.active ? s.ndcX * 0.6 : Math.sin(t * 0.5) * 0.4;
    const swayX = s.active ? -s.ndcY * 0.35 : Math.sin(t * 0.37 + 1) * 0.15;
    s.rotY += (swayY * fin * idleK - s.rotY) * Math.min(1, dt * 3.5);
    s.rotX += (swayX * fin * idleK - s.rotX) * Math.min(1, dt * 3.5);
    g.rotation.y = s.rotY;
    g.rotation.x = s.rotX;
    g.updateMatrixWorld(true);

    // Pointer on the mark plane (world z = 0; the camera looks down -z along the axis).
    let mx = 999;
    let my = 999;
    if (s.active) {
      const wx = (s.ndcX * visW) / 2;
      const wy = (s.ndcY * visH) / 2;
      s.local.set(wx, wy, 0);
      g.worldToLocal(s.local);
      mx = s.local.x;
      my = s.local.y;
      s.lightX += (wx - s.lightX) * Math.min(1, dt * 10);
      s.lightY += (wy - s.lightY) * Math.min(1, dt * 10);
    } else {
      s.lightX += (Math.sin(t * 0.5) * 3 - s.lightX) * Math.min(1, dt * 2);
      s.lightY += (2 - s.lightY) * Math.min(1, dt * 2);
    }
    const L = light.current;
    if (L) {
      L.position.set(s.lightX, s.lightY, 3);
      L.intensity = 3 * sm(0.25, 0.9, sp);
    }

    const { target: tg, spawn, rot0, spin, swirl, delay, tilt, phase } = data;
    const dummy = s.dummy;
    const hover = s.active && fin > 0.5;
    const spring = Math.min(1, dt * 7);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const loc = Math.min(1, Math.max(0, (sp - delay[i] * 0.55) / 0.45));
      const e = easeOut(loc);
      const k = 1 - e;
      let X = spawn[i3] + (tg[i3] - spawn[i3]) * e;
      let Y = spawn[i3 + 1] + (tg[i3 + 1] - spawn[i3 + 1]) * e;
      const Z = spawn[i3 + 2] + (tg[i3 + 2] - spawn[i3 + 2]) * e;
      const a = swirl[i] * k * k;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const X2 = X * ca - Y * sa;
      Y = X * sa + Y * ca;
      X = X2;

      let wx = 0;
      let wy = 0;
      let wz = 0;
      if (hover && e > 0.98) {
        const dx = X - mx;
        const dy = Y - my;
        const dd = Math.sqrt(dx * dx + dy * dy);
        if (dd < HOVER_RADIUS) {
          const f = (1 - dd / HOVER_RADIUS) * (1 - dd / HOVER_RADIUS);
          const n = dd || 1;
          wx = (dx / n) * f * 1.3;
          wy = (dy / n) * f * 1.3;
          wz = f * 1.5;
        }
      }
      off[i3] += (wx - off[i3]) * spring;
      off[i3 + 1] += (wy - off[i3 + 1]) * spring;
      off[i3 + 2] += (wz - off[i3 + 2]) * spring;

      const shim = Math.sin(t * 0.7 + phase[i]) * 0.05 * fin * idleK;
      dummy.position.set(X + off[i3], Y + off[i3 + 1], Z + off[i3 + 2]);
      dummy.rotation.set(
        ((rot0[i3] + t * spin[i * 2]) % TAU) * k + tilt[i3] * e + shim + off[i3 + 1] * 0.8,
        ((rot0[i3 + 1] + t * spin[i * 2 + 1]) % TAU) * k + tilt[i3 + 1] * e + shim * 0.8 + off[i3] * 0.8,
        (rot0[i3 + 2] % TAU) * k + tilt[i3 + 2] * e,
      );
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={group}>
        <instancedMesh
          key={`${count}-${material}`}
          ref={mesh}
          args={[geometry, mat, count]}
          frustumCulled={false}
          visible={false}
        />
      </group>
      {/* Cursor light. Intensity is driven in useFrame. */}
      <pointLight ref={light} color="#ffffff" distance={9} decay={1.6} intensity={0} position={[0, 2, 3]} />
    </>
  );
}
