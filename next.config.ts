import type { NextConfig } from "next";

// Cache Components is intentionally off: Keystatic's reader uses async file
// reads, and the classic model lets pages prerender at build time, refresh
// daily via `export const revalidate`, and re-read content on every request in dev.
const nextConfig: NextConfig = {
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
