import type { Metadata } from "next";
import { pageMetadata } from "@/lib/cms/metadata";
import { getSiteSettings } from "@/lib/cms/site-data";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Privacy Policy",
    description: "How Cee-Shell collects, uses and protects information submitted through this website.",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  const { email } = await getSiteSettings();

  return (
    <Section className="pt-40">
      <Container className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl font-medium text-primary sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted">Last updated: January 2026</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-muted">
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Information We Collect</h2>
            <p className="mt-3">
              When you submit a project inquiry, subscribe to our newsletter, or otherwise contact Cee-Shell, we collect the information you provide directly — such as your name, company, email address, phone number and project details.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">How We Use Information</h2>
            <p className="mt-3">
              Information submitted through this site is used solely to respond to inquiries, prepare proposals, deliver newsletter content you&apos;ve opted into, and improve our services. We do not sell or rent your information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Cookies &amp; Analytics</h2>
            <p className="mt-3">
              This site may use basic analytics cookies to understand aggregate visitor behaviour and improve site performance. No personally identifying analytics data is sold or shared with third parties for advertising purposes.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Data Retention</h2>
            <p className="mt-3">
              Project inquiry information is retained for as long as necessary to respond to your request and, if a project proceeds, for the duration of our working relationship and applicable record-keeping requirements.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Your Rights</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of your personal information at any time by contacting{" "}
              <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
                {email}
              </a>
              .
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Contact</h2>
            <p className="mt-3">
              Questions about this policy can be directed to{" "}
              <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
                {email}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
