/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async rewrites() {
    return [
      {
        source: '/api/mma/:path*',
        destination: 'https://work.mma.go.kr/:path*'
      }
    ];
  }
};

module.exports = nextConfig; 