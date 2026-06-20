/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // MVPフェーズのためビルド時の型エラーとESLintをスキップ
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
