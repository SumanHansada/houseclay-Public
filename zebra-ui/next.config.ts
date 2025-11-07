import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["lucide-react", "react-loading-skeleton"],
  },
  allowedDevOrigins: ["localhost.houseclay.com"],
  images: {
    remotePatterns: [
      {
        hostname: "houseclay.s3.ap-south-1.amazonaws.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 3600,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    // This webpack config will only apply when NOT using Turbopack
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
