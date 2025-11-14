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
  productionBrowserSourceMaps: true, // Disable in production for better performance
  webpack(config, { dev, isServer }) {
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
          // Framework-only vendor chunk (Next.js + React + React DOM)
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 40,
          },
          // Redux Toolkit and related
          rtk: {
            test: /[\\/]node_modules[\\/](@reduxjs|redux|immer|reselect)[\\/]/,
            name: "rtk",
            chunks: "all",
            priority: 30,
          },
          // Form libraries
          formik: {
            test: /[\\/]node_modules[\\/](formik|yup)[\\/]/,
            name: "formik",
            chunks: "all",
            priority: 30,
          },
          // Date utilities
          dateFns: {
            test: /[\\/]node_modules[\\/]date-fns[\\/]/,
            name: "date-fns",
            chunks: "all",
            priority: 30,
          },
          // HTTP client
          axios: {
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            name: "axios",
            chunks: "all",
            priority: 30,
          },
          // Phone input
          phone: {
            test: /[\\/]node_modules[\\/]react-international-phone[\\/]/,
            name: "react-international-phone",
            chunks: "all",
            priority: 30,
          },
          // File dropzone
          dropzone: {
            test: /[\\/]node_modules[\\/]react-dropzone[\\/]/,
            name: "react-dropzone",
            chunks: "all",
            priority: 30,
          },
          // Query libraries
          query: {
            test: /[\\/]node_modules[\\/](@tanstack|react-query)[\\/]/,
            name: "query",
            chunks: "all",
            priority: 30,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](react-hot-toast|focus-trap|tabbable|react-loading-skeleton)[\\/]/,
            name: "ui",
            chunks: "all",
            priority: 30,
          },
          // Maps and media
          media: {
            test: /[\\/]node_modules[\\/](@vis\.gl|react-photo-album)[\\/]/,
            name: "media",
            chunks: "all",
            priority: 30,
          },
          // Utilities
          utils: {
            test: /[\\/]node_modules[\\/](buffer|process|base64-js|ieee754|js-cookie|property-expr|tiny-case|toposort|prop-types|react-fast-compare|react-is)[\\/]/,
            name: "utils",
            chunks: "all",
            priority: 30,
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
