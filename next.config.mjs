/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'play.google.com',
      },
      {
        hostname: 'img.clerk.com',
      },
      { hostname: 'lifecoach.turskyi.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
