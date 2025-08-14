import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://shop.faceon.live/api' 
      : 'http://localhost:6000/api'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'http://localhost:6000/api/:path*' 
          : 'http://localhost:6000/api/:path*'
      }
    ]
  }
};

export default nextConfig;
