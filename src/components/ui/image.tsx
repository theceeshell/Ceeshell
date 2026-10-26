"use client";

import NextImage, { type ImageLoaderProps, type ImageProps } from "next/image";
import { isOptimizableImage } from "@/lib/image-hosts";
import { cloudinaryTransform, isCloudinaryUrl } from "@/lib/media";

/** Cloudinary resizes and picks the best format itself, so these images skip Vercel's optimizer (and its quota). */
function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  return cloudinaryTransform(src, `f_auto,q_${quality ?? "auto"},c_limit,w_${width}`);
}

/**
 * next/image with the right optimizer per host: Cloudinary images use
 * Cloudinary's CDN, allowlisted hosts use Next's optimizer, anything else an
 * editor pastes is served as-is instead of failing.
 */
export default function Image(props: ImageProps) {
  if (typeof props.src === "string" && isCloudinaryUrl(props.src)) {
    return <NextImage {...props} loader={cloudinaryLoader} />;
  }
  const unoptimized = props.unoptimized ?? (typeof props.src === "string" && !isOptimizableImage(props.src));
  return <NextImage {...props} unoptimized={unoptimized} />;
}
