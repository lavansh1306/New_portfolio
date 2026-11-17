import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export: deploy the `out/` folder to Vercel, Netlify or any static host.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  trailingSlash: true,
  // PREVIEW=1 builds with relative asset paths so the export can be hosted from any sub-folder.
  ...(process.env.PREVIEW ? { assetPrefix: "." } : {}),
};

export default nextConfig;
