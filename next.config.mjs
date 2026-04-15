/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'down-id.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.susercontent.com',
      },
    ],
  },
};

export default nextConfig;
