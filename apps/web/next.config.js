/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'probaho.app'],
  },
  transpilePackages: ['@probaho/shared'],
}

module.exports = nextConfig
