import type { NextConfig } from "next";

// Cache Components is intentionally off: Keystatic's reader uses async file
// reads, and the classic model lets pages prerender at build time, refresh
// daily via `export const revalidate`, and re-read content on every request in dev.
const nextConfig: NextConfig = {
  // Keystatic's GitHub mode moves the local admin from localhost to 127.0.0.1
  // (GitHub's OAuth callback); let the dev server accept that origin.
  allowedDevOrigins: ['127.0.0.1'],
  // Pages with `revalidate` (home, schedule, repertoire) re-render in a
  // serverless function. Keystatic's reader reads content/ from disk with
  // dynamic paths that file tracing can't see, so ship the folder explicitly;
  // otherwise the daily refresh renders empty content (e.g. no hero image).
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
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
