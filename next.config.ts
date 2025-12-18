import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.storyblok.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// https://a.storyblok.com
export default nextConfig;
