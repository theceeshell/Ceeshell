import NextImage, { type ImageProps } from "next/image";
import { isOptimizableImage } from "@/lib/image-hosts";

/** next/image that falls back to an unoptimized <img> for hosts outside the optimizer allowlist. */
export default function Image(props: ImageProps) {
  const unoptimized = props.unoptimized ?? (typeof props.src === "string" && !isOptimizableImage(props.src));
  return <NextImage {...props} unoptimized={unoptimized} />;
}
