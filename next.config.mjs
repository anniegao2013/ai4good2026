/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure gremlin (used only in the seed script) is not bundled by Next.js
  experimental: {
    serverComponentsExternalPackages: ['gremlin'],
  },
}

export default nextConfig
