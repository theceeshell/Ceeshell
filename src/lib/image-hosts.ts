/**
 * Hosts whose images go through Next's image optimizer (Vercel bills/limits
 * optimizations, so this is an allowlist rather than "**"). Shared by
 * next.config.ts and <Image> in components/ui/image.tsx, which serves any other
 * URL an editor pastes unoptimized instead of failing.
 */
export const OPTIMIZED_IMAGE_PATTERNS = [
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
  // Media Library uploads (Supabase Storage public bucket).
  { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
] as const;

export function isOptimizableImage(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const { protocol, hostname, pathname } = new URL(src);
    return OPTIMIZED_IMAGE_PATTERNS.some(
      (p) =>
        protocol === `${p.protocol}:` &&
        (p.hostname.startsWith("*.") ? hostname.endsWith(p.hostname.slice(1)) : hostname === p.hostname) &&
        pathname.startsWith(p.pathname.replace("/**", ""))
    );
  } catch {
    return false;
  }
}
