import {
  BackSide,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  SphereGeometry,
} from "three";

/**
 * Small dark photo studio built in code (no HDR download), used as input for PMREMGenerator.fromScene.
 * Chrome only reads as chrome against contrast: a near black room with a handful of bright softboxes.
 * The camera looks down -z, so a flat front face mirrors whatever sits behind the camera (+z). That wall
 * is a stack of bands with different luminance, so the tiny per-cube tilts land on different bands and
 * each facet gets its own grey, like the Figma mark. Strips left/right/top catch the rounded edges.
 * Values above 1 are intentional (HDR, so bloom only picks up the real highlights).
 */
export function buildStudio() {
  const scene = new Scene();
  const disposables: { dispose(): void }[] = [];

  const room = new Mesh(
    new SphereGeometry(30, 32, 16),
    new MeshBasicMaterial({ color: new Color(0.012, 0.012, 0.014), side: BackSide }),
  );
  scene.add(room);
  disposables.push(room.geometry, room.material as MeshBasicMaterial);

  const panel = (w: number, h: number, lum: number, x: number, y: number, z: number, tint?: string) => {
    const mat = new MeshBasicMaterial({ color: new Color(tint ?? "#ffffff").multiplyScalar(lum) });
    const m = new Mesh(new PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    scene.add(m);
    disposables.push(m.geometry, mat);
    return m;
  };

  // Wall behind the camera: horizontal bands from dark to bright.
  const bands = [0.03, 0.4, 0.1, 0.95, 0.15, 0.35, 0.06];
  const bandH = 3;
  bands.forEach((lum, i) => {
    panel(30, bandH, lum, 0, (i - (bands.length - 1) / 2) * bandH, 14);
  });
  // Large soft top box and low fill.
  panel(14, 6, 3.0, 0, 16, 2);
  panel(18, 3, 0.35, 0, -14, 4);
  // Side strip lights (rim on bevels), left white, right a faint cool tint.
  panel(2.2, 20, 4.5, -13, 0, 3);
  panel(2.2, 20, 3.2, 13, 0, 3, "#f2efff");
  // Back strips so the mark has edge light when it sways.
  panel(3, 18, 2.5, -6, 2, -14);
  panel(3, 18, 2.5, 7, 2, -14, "#efe4ff");

  return {
    scene,
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
