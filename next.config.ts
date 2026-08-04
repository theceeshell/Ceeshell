import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CMS fields (logo, portfolio covers, blog images, team photos, ...) accept
    // any image URL an editor pastes in (Cloudinary, S3, etc.), not just Unsplash.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
