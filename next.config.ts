import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // ppr: true,
  },
  images: {
    unoptimized: true, // Useful for static deployments
  },
};

export default nextConfig;
