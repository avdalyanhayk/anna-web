import type { NextConfig } from "next";

// Cache Components is intentionally off: Keystatic's reader uses async file
// reads, and the classic model lets pages prerender at build time, refresh
// daily via `export const revalidate`, and re-read content on every request in dev.
const nextConfig: NextConfig = {
  // Keystatic's GitHub mode moves the local admin from localhost to 127.0.0.1
  // (GitHub's OAuth callback); let the dev server accept that origin.
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    // YouTube thumbnails for the video players (one small transform per video).
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
