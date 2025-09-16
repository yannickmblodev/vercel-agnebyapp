// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config, { dev }) => {
//     config.cache = { type: 'memory' };
//     return config;
//   },
//   transpilePackages: ['lucide-react'],
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// module.exports = nextConfig;

// module.exports = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };


/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = { type: 'memory' };
    return config;
  },
  transpilePackages: ['lucide-react'],

  // ❌ PAS d'output: 'export' si tu veux des API/SSR

  images: { unoptimized: true },

  eslint: {
    ignoreDuringBuilds: true, // ne bloque pas le build
  },
  typescript: {
    ignoreBuildErrors: true,  // ne bloque pas le build
  },
};

module.exports = nextConfig;
