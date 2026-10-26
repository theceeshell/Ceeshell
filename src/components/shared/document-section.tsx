import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { sanitizeBlogHtml } from "@/lib/cms/html";

/** Long-form formatted text (privacy policy, terms, ...), edited with the rich text editor. */
export function DocumentSection({ heading, intro, html }: { heading: string; intro?: string; html: string }) {
  return (
    <Section className="pt-40">
      <Container className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl font-medium text-primary sm:text-5xl">{heading}</h1>
        {intro && <p className="mt-4 text-sm text-muted">{intro}</p>}
        <div
          className="mt-12 text-base leading-relaxed text-muted [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-primary [&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-primary [&_img]:my-8 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&>*:first-child]:mt-0"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(html) }}
        />
      </Container>
    </Section>
  );
}
