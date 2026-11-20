/**
 * Base path the site is served from. Empty for xpansly.ai (served at the root); set at build
 * time via NEXT_PUBLIC_BASE_PATH (e.g. "/xpansly" for the GitHub Pages preview).
 * Next.js prefixes its own routes and chunks, but not raw <img>/<source> URLs, so every
 * static asset path goes through ASSETS.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const ASSETS = `${basePath}/assets`;
