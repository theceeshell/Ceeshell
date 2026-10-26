/**
 * Detects a file's real type from its leading bytes, so an upload can't pass
 * itself off as an image/PDF just by lying about its name or Content-Type.
 * Only the formats the site actually accepts are recognised.
 */

export interface DetectedType {
  mime: string;
  ext: string;
}

const OOXML: Record<string, DetectedType> = {
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: "docx" },
  pptx: { mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", ext: "pptx" },
};

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((b, i) => bytes[offset + i] === b);
}

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.subarray(start, end));
}

/** `filename` is only used to tell .docx from .pptx (both are ZIP containers). */
export function detectFileType(bytes: Uint8Array, filename = ""): DetectedType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { mime: "image/jpeg", ext: "jpg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { mime: "image/png", ext: "png" };
  if (ascii(bytes, 0, 6) === "GIF87a" || ascii(bytes, 0, 6) === "GIF89a") return { mime: "image/gif", ext: "gif" };
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (ascii(bytes, 4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(bytes, 8, 12))) return { mime: "image/avif", ext: "avif" };
  if (ascii(bytes, 0, 5) === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) {
    const ext = filename.toLowerCase().split(".").pop() ?? "";
    return OOXML[ext] ?? null;
  }
  return null;
}
