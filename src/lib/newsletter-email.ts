import "server-only";
import { sanitizeBlogHtml } from "@/lib/cms/html";

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * Wraps newsletter content in a simple, email-client-safe layout. Brevo
 * replaces {{ unsubscribe }} with each recipient's unsubscribe link; the
 * postal address is required by anti-spam rules.
 */
export function renderNewsletterHtml({
  subject,
  bodyHtml,
  siteName,
  siteUrl,
  address,
  forTest = false,
}: {
  subject: string;
  bodyHtml: string;
  siteName: string;
  siteUrl: string;
  address: string;
  forTest?: boolean;
}) {
  const unsubscribe = forTest ? "#" : "{{ unsubscribe }}";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(subject)}</title>
<style>
  body { margin:0; padding:0; background:#F8F7F4; }
  .content img { max-width:100%; height:auto; border-radius:12px; display:block; margin:16px 0; }
  .content a { color:#1E5D83; }
  .content h2 { font-family:Georgia,serif; font-weight:500; color:#0E3557; font-size:22px; margin:28px 0 8px; }
  .content h3 { font-family:Georgia,serif; font-weight:500; color:#0E3557; font-size:18px; margin:24px 0 8px; }
  .content p, .content li { font-size:15px; line-height:1.65; color:#3d4652; }
  .content blockquote { border-left:3px solid #c9d3dd; margin:16px 0; padding-left:14px; font-style:italic; }
</style>
</head>
<body>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#0E3557;padding:22px 32px;">
        <a href="${escape(siteUrl)}" style="font-family:Georgia,serif;font-size:24px;color:#ffffff;text-decoration:none;">${escape(siteName)}</a>
      </td></tr>
      <tr><td class="content" style="padding:28px 32px;font-family:Arial,Helvetica,sans-serif;">
        ${sanitizeBlogHtml(bodyHtml)}
      </td></tr>
      <tr><td style="padding:20px 32px 28px;border-top:1px solid #eceae4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#7a828c;">
        You're receiving this because you subscribed on <a href="${escape(siteUrl)}" style="color:#7a828c;">${escape(siteName)}</a>.<br>
        ${escape(address)}<br>
        <a href="${unsubscribe}" style="color:#7a828c;">Unsubscribe</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
