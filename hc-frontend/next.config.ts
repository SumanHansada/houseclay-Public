import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import path from "path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "react-loading-skeleton"],
  },
  // Enable compression
  compress: true,
  // Enable static generation where possible
  staticPageGenerationTimeout: 120,
  // Optimize images
  images: {
    remotePatterns: [
      {
        hostname: "houseclay.s3.ap-southeast-2.amazonaws.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
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
  productionBrowserSourceMaps: false, // Disable in production for better performance
  webpack(config, { dev, isServer }) {
    // Force Next’s compiled react-dom to resolve to your app’s react-dom
    config.resolve.alias["next/dist/compiled/react-dom"] = path.resolve(
      __dirname,
      "node_modules/react-dom",
    );

    // This webpack config will only apply when NOT using Turbopack
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          // Separate dialog chunks
          dialogs: {
            test: /[\\/]dialogs[\\/]/,
            name: "dialogs",
            chunks: "all",
            priority: 20,
          },
          // Separate icon chunks
          icons: {
            test: /[\\/]icons[\\/]/,
            name: "icons",
            chunks: "all",
            priority: 20,
          },
          // Separate lucide-react icons
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: "lucide",
            chunks: "all",
            priority: 20,
          },
          // Separate Lottie library
          lottie: {
            test: /[\\/]node_modules[\\/]@lottiefiles[\\/]/,
            name: "lottie",
            chunks: "all",
            priority: 20,
          },
          // Separate Framer library
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer",
            chunks: "all",
            priority: 20,
          },
          // Separate Motion library
          motion: {
            test: /[\\/]node_modules[\\/]motion[\\/]/,
            name: "motion",
            chunks: "all",
            priority: 20,
          },
          // Separate Motion Dom library
          motionDom: {
            test: /[\\/]node_modules[\\/]motion-dom[\\/]/,
            name: "motion-dom",
            chunks: "all",
            priority: 20,
          },
        },
      };
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
