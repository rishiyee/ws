import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    webpackBuildWorker: false,
  },
};

export default config;
