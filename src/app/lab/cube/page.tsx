"use client";

/**
 * DEV ONLY look-dev route for the 3D mark. Delete (or gate) before launch.
 * Query: ?p=0..1 &m=chrome|glass &q=high|low &idle=0|1 &ui=0
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Scene = dynamic(() => import("@/components/sections/Problem/three/Scene").then((m) => m.Scene), {
  ssr: false,
});

export default function CubeLab() {
  const [p, setP] = useState(1);
  const [m, setM] = useState<"chrome" | "glass">("chrome");
  const [q, setQ] = useState<"high" | "low">("high");
  const [idle, setIdle] = useState(1);
  const [ui, setUi] = useState(true);
  const [ready, setReady] = useState(false);
  const [parsed, setParsed] = useState(false);
  const ref = useRef(1);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const np = Number(sp.get("p") ?? 1);
    setP(np);
    ref.current = np;
    setM(sp.get("m") === "glass" ? "glass" : "chrome");
    setQ(sp.get("q") === "low" ? "low" : "high");
    setIdle(Number(sp.get("idle") ?? 1));
    setUi(sp.get("ui") !== "0");
    setParsed(true);
  }, []);

  return (
    <main
      data-ready={ready ? "1" : "0"}
      style={{ position: "fixed", inset: 0, background: "#0a0a0a", color: "#ddd", font: "12px/1.4 monospace" }}
    >
      {parsed && (
        <Scene progress={ref} material={m} quality={q} idle={idle} onReady={() => setReady(true)} />
      )}
      {ui && (
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            padding: 10,
            background: "rgba(0,0,0,.6)",
            border: "1px solid #333",
            display: "grid",
            gap: 6,
            zIndex: 2,
          }}
        >
          <label>
            progress {p.toFixed(2)}
            <input
              type="range"
              min={0}
              max={1}
              step={0.005}
              value={p}
              style={{ display: "block", width: 200 }}
              onChange={(e) => {
                const v = Number(e.target.value);
                setP(v);
                ref.current = v;
              }}
            />
          </label>
          <span>
            material <button onClick={() => setM("chrome")}>chrome</button>{" "}
            <button onClick={() => setM("glass")}>glass</button>
          </span>
          <span>
            quality <button onClick={() => setQ("high")}>high</button>{" "}
            <button onClick={() => setQ("low")}>low</button>
          </span>
          <label>
            <input type="checkbox" checked={idle === 1} onChange={(e) => setIdle(e.target.checked ? 1 : 0)} /> idle sway
          </label>
        </div>
      )}
    </main>
  );
}
