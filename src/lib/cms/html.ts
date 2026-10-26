import sanitizeHtml from "sanitize-html";

/**
 * Allow-list matching what the Tiptap StarterKit editor can produce. Blog
 * HTML is posted by the client, so it's sanitized on save AND on render
 * (rows saved before sanitization existed are covered too).
 */
const BLOG_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "code", "pre",
    "blockquote", "ul", "ol", "li", "a",
  ],
  allowedAttributes: { a: ["href", "target", "rel"], ol: ["start"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
    }),
  },
};

export function sanitizeBlogHtml(html: string) {
  return sanitizeHtml(html, BLOG_HTML_OPTIONS);
}

/** Serializes JSON-LD for a <script> tag without letting CMS text close the tag early. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
