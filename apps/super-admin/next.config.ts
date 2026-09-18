import type { NextConfig } from "next";

const API_INTERNAL = process.env.API_INTERNAL_URL || 'http://localhost:4000/api/v1';

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_INTERNAL}/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
