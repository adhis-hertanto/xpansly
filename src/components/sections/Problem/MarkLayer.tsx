"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { MARK_MATERIAL } from "./three/config";
import styles from "./Problem.module.css";

// The whole three/r3f/postprocessing bundle lives in this chunk, never in the initial page JS.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

type Quality = "high" | "low";

function detectQuality(): Quality {
  try {
    const forced = new URLSearchParams(window.location.search).get("cubeq");
    if (forced === "high" || forced === "low") return forced;
  } catch {}
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const small = window.innerWidth < 768;
  return coarse || small || cores <= 4 || mem <= 4 ? "low" : "high";
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function useInView(ref: MutableRefObject<HTMLElement | null>, rootMargin: string, enabled: boolean) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => setInView(entries[entries.length - 1].isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, enabled]);
  return inView;
}

/**
 * Background layer of the stage: poster image (placeholder, and fallback for reduced motion or
 * WebGL failure) plus the lazily loaded canvas. `progress` is a ref written by the scroll mapping.
 */
export function MarkLayer({ progress, reduced }: { progress: MutableRefObject<number>; reduced: boolean }) {
  const root = useRef<HTMLDivElement | null>(null);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const active = !reduced && !failed;
  // The section starts right below the hero fold, so a "100% ahead" margin would load the 3D chunk on
  // first paint. Load once the stage first enters the viewport (the stage is black for the first
  // ~12% of the track and cubes start at 25%, so the chunk has the scroll distance to arrive).
  const visible = useInView(root, "0px", active);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (visible) setNear(true);
  }, [visible]);

  useEffect(() => {
    if (reduced) return;
    if (!hasWebGL()) {
      setFailed(true);
      return;
    }
    setQuality(detectQuality());
  }, [reduced]);

  const showScene = active && quality !== null && near;

  return (
    <div ref={root} className={styles.layer} aria-hidden="true">
      <div className={styles.poster}>
        <div className={styles.posterInner} style={{ "--pn": ready && !failed ? 0 : 1 } as CSSProperties}>
          <picture>
            <source
              type="image/avif"
              srcSet="/assets/problem/mark-poster-1200.avif 1200w, /assets/problem/mark-poster-2000.avif 2000w"
              sizes="min(100vh, 110vw)"
            />
            <source
              type="image/webp"
              srcSet="/assets/problem/mark-poster-1200.webp 1200w, /assets/problem/mark-poster-2000.webp 2000w"
              sizes="min(100vh, 110vw)"
            />
            <img
              className={styles.posterImg}
              src="/assets/problem/mark-poster-1200.webp"
              width={1200}
              height={1190}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
      {showScene && (
        <div className={`${styles.canvas} ${ready ? styles.canvasReady : ""}`}>
          <Boundary onError={() => setFailed(true)}>
            <Scene
              progress={progress}
              material={MARK_MATERIAL}
              quality={quality}
              // Keep rendering until the first frames are out (so the crossfade can happen), then
              // only while the stage is on screen.
              paused={ready && !visible}
              onReady={() => setReady(true)}
              onContextLost={() => setFailed(true)}
            />
          </Boundary>
        </div>
      )}
    </div>
  );
}
