/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@probaho/shared'],
  basePath: '/ProbahoWebApp',
  assetPrefix: '/ProbahoWebApp',
  reactStrictMode: true,
  swcMinify: true,
}
