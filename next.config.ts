import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    webpackBuildWorker: false,
  },
};

export default config;
