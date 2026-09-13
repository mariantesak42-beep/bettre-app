import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's generator writes its query-engine binary into a custom output
  // directory (src/generated/prisma) instead of node_modules, so Next's
  // automatic dependency tracing for serverless functions can miss it —
  // force-include it for every route (API routes and proxy.ts both use it).
  outputFileTracingIncludes: {
    "/**/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
