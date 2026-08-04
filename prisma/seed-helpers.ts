/** Normalizes any typed value into a plain JSON-compatible value for Prisma's Json columns. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toJson(value: unknown): any {
  return JSON.parse(JSON.stringify(value));
}

export function blocksToContent(blocks: { heading: string; body: string }[]) {
  const contentJson = {
    type: "doc",
    content: blocks.flatMap((block) => [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: block.heading }] },
      { type: "paragraph", content: [{ type: "text", text: block.body }] },
    ]),
  };

  const contentHtml = blocks
    .map((block) => `<h2>${escapeHtml(block.heading)}</h2><p>${escapeHtml(block.body)}</p>`)
    .join("\n");

  return { contentJson, contentHtml };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
