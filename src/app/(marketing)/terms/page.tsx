import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of the Cee-Shell website and engagement of Cee-Shell's creative services.",
};

export default function TermsPage() {
  return (
    <Section className="pt-40">
      <Container className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl font-medium text-primary sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-muted">Last updated: January 2026</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-muted">
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Use of This Website</h2>
            <p className="mt-3">
              This website is provided by Cee-Shell for the purpose of showcasing our work and enabling prospective clients to submit project inquiries. Content on this site may not be reproduced or used for commercial purposes without written permission.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Project Engagements</h2>
            <p className="mt-3">
              Submitting an inquiry through this website does not constitute a binding agreement. All project engagements are governed by a separate signed proposal or contract outlining scope, deliverables, timeline and payment terms.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Intellectual Property</h2>
            <p className="mt-3">
              Portfolio work displayed on this site remains the intellectual property of Cee-Shell and the respective clients unless otherwise agreed in writing. Ownership of deliverables from a specific engagement is defined in that engagement's contract.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Limitation of Liability</h2>
            <p className="mt-3">
              Cee-Shell makes reasonable efforts to keep this website accurate and available but does not guarantee uninterrupted access and is not liable for damages arising from use of this site.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Changes to These Terms</h2>
            <p className="mt-3">
              These terms may be updated periodically. Continued use of this website after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-medium text-primary">Contact</h2>
            <p className="mt-3">Questions about these terms can be directed to hello@cee-shell.com.</p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
