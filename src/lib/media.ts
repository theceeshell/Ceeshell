/**
 * Media fields (hero backgrounds, service images, galleries) hold either an
 * image URL or a video URL. Videos are recognised by file extension or by
 * Cloudinary's /video/upload/ path. Safe to import on client and server.
 */

const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

export function isCloudinaryUrl(url: string) {
  return /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\//.test(url);
}

export function isVideoUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return VIDEO_EXTENSION.test(url) || /^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(url);
}

/** Inserts a Cloudinary transformation right after /upload/ (chained with any existing ones). */
export function cloudinaryTransform(url: string, transformation: string) {
  return url.replace(/\/(image|video)\/upload\//, `/$1/upload/${transformation}/`);
}

/** Cloudinary picks the best format/quality per browser and caps the size, which keeps bandwidth (and the free quota) low. */
export function optimizedVideoUrl(url: string, maxWidth = 1920) {
  return isCloudinaryUrl(url) ? cloudinaryTransform(url, `f_auto,q_auto,c_limit,w_${maxWidth}`) : url;
}

/** A still frame for a video's poster (Cloudinary only; other hosts get none). */
export function videoPosterUrl(url: string, maxWidth = 1920) {
  if (!isCloudinaryUrl(url)) return undefined;
  return cloudinaryTransform(url, `so_0,f_auto,q_auto,c_limit,w_${maxWidth}`).replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}

/** A still image for places that can't play video (cards, social-share images). */
export function stillImageUrl(url: string) {
  return isVideoUrl(url) ? videoPosterUrl(url) : url;
}
