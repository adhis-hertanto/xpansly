import localFont from "next/font/local";

export { GeistSans } from "geist/font/sans";
export { GeistMono } from "geist/font/mono";

/**
 * Recia (Indian Type Foundry, Fontshare licence). Only Medium is used on the page
 * (Display, Heading 1, Heading 2). Latin subset woff2, generated from Recia-Medium.otf.
 * next/font preloads it and generates a metric-matched fallback, so there is no CLS.
 */
export const recia = localFont({
  src: [{ path: "../../public/fonts/recia/Recia-Medium.woff2", weight: "500", style: "normal" }],
  variable: "--font-recia",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
