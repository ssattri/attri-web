import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {},
  async rewrites() {
    return [{ source: "/ss_attri/admin", destination: "/admin" }, { source: "/ss_attri/admin/:path*", destination: "/admin/:path*" }];
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "cloudflare:workers": path.resolve(__dirname, "app/node-runtime.ts"),
      "@server": path.resolve(__dirname, "app/node-runtime.ts"),
    };
    return config;
  },
};

export default nextConfig;
