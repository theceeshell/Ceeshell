import "server-only";

/**
 * Emails the studio about a new inquiry via Resend (free tier: 3,000/month).
 * Entirely optional: without RESEND_API_KEY + INQUIRY_NOTIFY_EMAIL it does
 * nothing, and inquiries are still visible in Admin -> Contact Inquiries.
 * Plain text only, so nothing a visitor typed is ever rendered as HTML.
 */
export async function sendInquiryNotification(inquiry: {
  name: string;
  company: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  hasAttachment: boolean;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const lines = [
    `Name: ${inquiry.name}`,
    `Company: ${inquiry.company}`,
    `Email: ${inquiry.email}`,
    inquiry.phone && `Phone: ${inquiry.phone}`,
    inquiry.service && `Service: ${inquiry.service}`,
    inquiry.budget && `Budget: ${inquiry.budget}`,
    inquiry.timeline && `Timeline: ${inquiry.timeline}`,
    inquiry.hasAttachment && "Attachment: yes (download it from the admin panel)",
  ].filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "Cee-Shell Website <onboarding@resend.dev>",
      to: to.split(",").map((address) => address.trim()),
      reply_to: inquiry.email,
      subject: `New inquiry from ${inquiry.name} (${inquiry.company})`.slice(0, 200),
      text: `${lines.join("\n")}\n\n${inquiry.message}`,
    }),
  });
  if (!res.ok) {
    console.error("Inquiry notification failed", res.status, await res.text().catch(() => ""));
  }
}
