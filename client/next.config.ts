import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Allow http
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https', // Allow https
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;