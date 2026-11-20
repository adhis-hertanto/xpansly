import type { NextConfig } from "next";

// "" for xpansly.ai (root). The GitHub Pages workflow sets NEXT_PUBLIC_BASE_PATH=/xpansly.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Static export friendly: `next build` writes ./out
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
