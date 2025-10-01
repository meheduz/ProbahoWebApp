/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true,  // Required for static export
    domains: ['localhost', 'probaho.app'],
  },
  transpilePackages: ['@probaho/shared'],
  basePath: '/ProbahoWebApp',  // Required for GitHub Pages
}
