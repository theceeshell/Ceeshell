import Image from "@/components/ui/image";
import { isVideoUrl, optimizedVideoUrl, videoPosterUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

/** One gallery tile: an image, or a video with play controls (loads nothing until played). */
export function GalleryMedia({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  if (isVideoUrl(src)) {
    return (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={optimizedVideoUrl(src, 1280)}
        poster={videoPosterUrl(src, 1280)}
        controls
        playsInline
        preload="none"
        aria-label={alt}
      />
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />;
}
