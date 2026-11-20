import localFont from "next/font/local";

/**
 * Geist and Geist Mono (Vercel, SIL OFL, see src/fonts/geist/OFL.txt). The page only uses
 * Regular (400), so we ship static Regular files subset to Latin (~17 KB and ~14 KB) instead of
 * the full variable fonts from the `geist` package (~70 KB each).
 */
export const GeistSans = localFont({
  src: [{ path: "../fonts/geist/Geist-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const GeistMono = localFont({
  src: [{ path: "../fonts/geist/GeistMono-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  adjustFontFallback: false,
});

/**
 * Recia (Indian Type Foundry, Fontshare licence). Only Medium is used on the page
 * (Display, Heading 1, Heading 2). Latin subset woff2, generated from Recia-Medium.otf.
 * next/font preloads it and generates a metric-matched fallback, so there is no CLS.
 */
export const recia = localFont({
  src: [{ path: "../fonts/recia/Recia-Medium.woff2", weight: "500", style: "normal" }],
  variable: "--font-recia",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
