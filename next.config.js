/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    config.cache = { type: 'memory' };
    return config;
  },
  transpilePackages: ['lucide-react'],
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
};
