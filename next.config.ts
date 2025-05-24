import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// https://a.storyblok.com
export default nextConfig;
