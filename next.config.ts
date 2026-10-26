import type { NextConfig } from "next";
import { OPTIMIZED_IMAGE_PATTERNS } from "./src/lib/image-hosts";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: OPTIMIZED_IMAGE_PATTERNS.map((p) => ({ ...p })),
    qualities: [75],
    // WebP only: AVIF would double the number of (quota-limited) transformations.
    formats: ["image/webp"],
    // Source URLs are effectively immutable (uploads get unique names), so cache optimized copies for 31 days.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    serverActions: {
      // Contact-form attachments are capped at 4MB; Vercel rejects request bodies over 4.5MB anyway.
      bodySizeLimit: "4.5mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
