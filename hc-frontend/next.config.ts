import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "react-loading-skeleton"],
  },
  allowedDevOrigins: ["localhost.houseclay.com"],
  // Enable compression
  compress: true,
  // Enable static generation where possible
  staticPageGenerationTimeout: 120,
  // Optimize images
  images: {
    remotePatterns: [
      {
        hostname: "houseclay.s3.ap-south-1.amazonaws.com",
      },
      { protocol: "https", hostname: "cdn.houseclay.com" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 3600,
  },
  // Turbopack configuration for development
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Remove console statements in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  productionBrowserSourceMaps: true, // Disable in production for better performance
  webpack(config, { dev, isServer }) {
    // This webpack config will only apply when NOT using Turbopack
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
