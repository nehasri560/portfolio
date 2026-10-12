import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the whole site is static: `next build` writes plain HTML/CSS/JS to ./out (served by Render as a static site)
  output: "export",
  poweredByHeader: false,
  // a stray lockfile in the home folder confuses root detection
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
