/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fbd5e6e464f1c81e82f4fdc9e6e71720.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
