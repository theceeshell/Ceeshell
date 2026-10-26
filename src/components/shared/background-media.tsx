"use client";

import * as React from "react";
import Image from "@/components/ui/image";
import { isVideoUrl, optimizedVideoUrl, videoPosterUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Full-bleed hero background: an image, or a muted looping video (Cloudinary
 * videos are optimized and get a poster frame). Visitors who prefer reduced
 * motion see the still frame instead of the playing video.
 */
export function BackgroundMedia({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  if (!isVideoUrl(src)) {
    return <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className={cn("object-cover", className)} />;
  }

  const poster = videoPosterUrl(src);
  if (reducedMotion && poster) {
    return <Image src={poster} alt={alt} fill priority={priority} sizes="100vw" className={cn("object-cover", className)} />;
  }

  return (
    <video
      key={src}
      className={cn("h-full w-full object-cover", className)}
      src={optimizedVideoUrl(src)}
      poster={poster}
      autoPlay={!reducedMotion}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    />
  );
}
