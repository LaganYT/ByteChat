/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `byte-chat-ochre.vercel.app:3001/:path*`, // Proxy to Socket.io server
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  