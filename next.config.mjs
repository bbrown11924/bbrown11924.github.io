/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  // For GitHub Pages project sites, set NEXT_PUBLIC_BASE_PATH to "/<repo-name>"
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
