import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "cloudflare:workers": path.resolve(__dirname, "app/node-runtime.ts"),
    };
    return config;
  },
};

export default nextConfig;
