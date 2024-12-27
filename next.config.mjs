/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-9c2a4f06918f438aa0a496689386a7dc.r2.dev",
      },
    ],
  },
};

export default nextConfig;
