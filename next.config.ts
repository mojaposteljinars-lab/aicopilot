import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Note: 'output: export' removed for Firebase deployment
  // API routes require server-side execution
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        ...config.resolve.fallback,
        fs: false, 
        net: false, 
        tls: false, 
        async_hooks: false,
        child_process: false,
        perf_hooks: false
      };
    }
    return config;
  },
};

export default nextConfig;
