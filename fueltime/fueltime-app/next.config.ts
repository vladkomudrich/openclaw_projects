import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable Turbopack temporarily for PWA compatibility
  turbopack: {},
  // PWA will be configured through service worker
};

export default nextConfig;
