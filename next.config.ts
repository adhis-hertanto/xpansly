import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export friendly: `next build` writes ./out
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
