import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  // outputFileTracingRoot: '/Users/plopix/Projects/CRYSTALLIZE/GITHUB/'
};

export default nextConfig;
