import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4566', // Localstack S3
        pathname: '/likebutter-bucket/**',
      },
    ],
  },
};

export default nextConfig;
