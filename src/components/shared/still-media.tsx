import Image from "@/components/ui/image";
import { isVideoUrl, videoPosterUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * A still picture for cards and thumbnails: the image itself, or a video's
 * poster frame (Cloudinary), or the video's first frame (other hosts).
 */
export function StillMedia({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  const still = isVideoUrl(src) ? videoPosterUrl(src, 1280) : src;
  if (still) return <Image src={still} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />;
  return <video src={`${src}#t=0.1`} muted playsInline preload="metadata" aria-label={alt} className={cn("h-full w-full object-cover", className)} />;
}
