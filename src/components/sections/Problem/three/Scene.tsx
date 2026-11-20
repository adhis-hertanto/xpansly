"use client";

import { useEffect, useLayoutEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { MathUtils, NoToneMapping, PMREMGenerator, type PerspectiveCamera } from "three";
import { buildStudio } from "./studioEnv";
import { CubeMark, type MarkMaterial } from "./CubeMark";
import { MARK_SIZE, type Quality } from "./markData";

export interface SceneProps {
  /**
   * Converge progress 0..1: 0 = all cubes outside the frame (nothing visible), 1 = locked into the mark.
   * Pass a MutableRefObject<number> (preferred: write `ref.current` from the scroll handler with no
   * React re-render) or a plain number. The value is smoothed internally.
   */
  progress: number | MutableRefObject<number>;
  /** Hero material is "chrome"; "glass" is the cheap transparent+fresnel variant (no transmission). */
  material?: MarkMaterial;
  /** "low" drops volume layers (fewer cubes), bloom and MSAA. */
  quality?: Quality;
  /** Stops rendering entirely (e.g. section offscreen). */
  paused?: boolean;
  /** Called once after the first frames have rendered. */
  onReady?: () => void;
  /** 0 freezes idle sway/shimmer. Default 1. */
  idle?: number;
  /** Shift the mark by a fraction of the visible viewport, e.g. [0.2, 0] for right of centre. */
  offset?: readonly [number, number];
  className?: string;
  /** Called if the WebGL context is lost (the page should fall back to the poster). */
  onContextLost?: () => void;
}

const FOV = 40;
// Figma: mark is 832 tall inside a 986 tall frame (84%).
const FILL_H = 832 / 986;

/** Studio environment (built in code, through PMREM, no network). */
function Studio({ intensity }: { intensity: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const studio = buildStudio();
    const rt = pmrem.fromScene(studio.scene, 0.02);
    scene.environment = rt.texture;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      studio.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
}

/** Frames the camera so the formed mark fills 84% of the height (or the width on tall screens). */
function Framing() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const visH = Math.max(MARK_SIZE / FILL_H, (MARK_SIZE * 1.08) / aspect);
    const d = visH / (2 * Math.tan(MathUtils.degToRad(FOV) / 2));
    camera.position.set(0, 0, d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

/** Dev only: counts rendered frames so tests can check the canvas really stops when paused. */
function FrameCounter() {
  useFrame(() => {
    const w = window as unknown as { __cubeFrames?: number };
    w.__cubeFrames = (w.__cubeFrames ?? 0) + 1;
  });
  return null;
}

function ReadyPing({ onReady }: { onReady?: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    if (n.current === 3) onReady?.();
    n.current++;
  });
  return null;
}

export function Scene({
  progress,
  material = "chrome",
  quality = "high",
  paused = false,
  onReady,
  idle = 1,
  offset,
  className,
  onContextLost,
}: SceneProps) {
  const high = quality === "high";
  const glass = material === "glass";
  return (
    <Canvas
      key={quality}
      className={className}
      dpr={high ? [1, 2] : [1, 1.5]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      frameloop={paused ? "never" : "always"}
      camera={{ fov: FOV, near: 0.1, far: 100, position: [0, 0, 11] }}
      gl={{
        antialias: !high,
        alpha: false,
        powerPreference: "high-performance",
        // No tone mapping: the composer would crush the #0a0a0a background, so both paths stay linear->sRGB.
        toneMapping: NoToneMapping,
        toneMappingExposure: 1,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <Framing />
      <Studio intensity={glass ? 0.55 : 0.9} />
      {/* Key accent from the upper left, and a very subtle purple rim from behind right. */}
      <directionalLight position={[-4, 5, 6]} intensity={1.4} color="#ffffff" />
      <pointLight position={[6, 2, -4]} intensity={4} distance={20} decay={1.5} color="#8c00f4" />
      <CubeMark progress={progress} material={material} quality={quality} idle={idle} offset={offset} />
      {high && (
        <EffectComposer multisampling={4} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.25} luminanceThreshold={1.15} luminanceSmoothing={0.25} radius={0.55} />
                  </EffectComposer>
      )}
      <ReadyPing onReady={onReady} />
      {process.env.NODE_ENV !== "production" && <FrameCounter />}
    </Canvas>
  );
}

export default Scene;
