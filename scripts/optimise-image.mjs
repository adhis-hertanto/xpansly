#!/usr/bin/env node
/**
 * Convert a raster exported from Figma into AVIF + WebP at the given widths.
 * Usage: node scripts/optimise-image.mjs <input.png|jpg> <outDir> <baseName> [width1,width2,...]
 * Example: node scripts/optimise-image.mjs tmp/hero.png public/assets/hero hero-bg 960,1440,2880
 * Writes <outDir>/<baseName>-<w>.avif and .webp; prints a srcset-ready summary.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [input, outDir, base, widthsArg] = process.argv.slice(2);
if (!input || !outDir || !base) {
  console.error("Usage: optimise-image.mjs <input> <outDir> <baseName> [widths]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const meta = await sharp(input).metadata();
const widths = (widthsArg ? widthsArg.split(",").map(Number) : [meta.width])
  .map((w) => Math.min(w, meta.width))
  .filter((w, i, a) => a.indexOf(w) === i);

for (const w of widths) {
  const img = sharp(input).resize({ width: w, withoutEnlargement: true });
  await img.clone().avif({ quality: 55, effort: 6 }).toFile(join(outDir, `${base}-${w}.avif`));
  await img.clone().webp({ quality: 78, effort: 6 }).toFile(join(outDir, `${base}-${w}.webp`));
  console.log(`${base}-${w}: ${w}x${Math.round((meta.height * w) / meta.width)}`);
}
console.log(`source ${meta.width}x${meta.height}`);
