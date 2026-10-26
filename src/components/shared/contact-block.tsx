import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm, type ContactFormOption } from "@/components/shared/contact-form";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { InstagramIcon, LinkedInIcon, BehanceIcon } from "@/components/shared/social-icons";
import type { FaqItemData } from "@/components/shared/faq-section";
import type { SiteTexts } from "@/lib/cms/site-texts";

export interface ContactSiteSettings {
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  googleMapsUrl: string;
  socialLinks: { instagram?: string; linkedin?: string; behance?: string };
}

interface ContactBlockProps {
  heading: string;
  description?: string;
  showMap: boolean;
  faqs: FaqItemData[];
  siteSettings: ContactSiteSettings;
  /** Choices for the form's Industry / Service dropdowns (visible items only). */
  industries: ContactFormOption[];
  services: ContactFormOption[];
  texts: { contactInfo: SiteTexts["contactInfo"]; contactForm: SiteTexts["contactForm"] };
  /** accessibility.mapTitle text (read aloud for the map). */
  mapTitle: string;
}

export function ContactBlock({ heading, description, showMap, faqs, siteSettings, industries, services, texts, mapTitle }: ContactBlockProps) {
  const t = texts.contactInfo;
  return (
    <>
      <Section>
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <h2 className="font-heading text-3xl font-medium text-primary sm:text-4xl">{heading}</h2>
            {description && <p className="mt-3 max-w-lg text-muted">{description}</p>}
            <div className="mt-10">
              <ContactForm industries={industries} services={services} texts={texts.contactForm} />
            </div>
          </Reveal>

          <Reveal direction="left" className="space-y-10">
            <div className="rounded-[1.75rem] border border-border bg-surface p-8">
              <h3 className="font-heading text-xl font-medium text-primary">{t.heading}</h3>
              <ul className="mt-6 space-y-5 text-sm">
                <InfoRow icon={Mail} label={t.emailLabel}>
                  <a href={`mailto:${siteSettings.email}`} className="hover:text-secondary">{siteSettings.email}</a>
                </InfoRow>
                <InfoRow icon={Phone} label={t.phoneLabel}>
                  <a href={`tel:${siteSettings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-secondary">{siteSettings.phone}</a>
                </InfoRow>
                <InfoRow icon={MapPin} label={t.addressLabel}>{siteSettings.address}</InfoRow>
                <InfoRow icon={Clock} label={t.hoursLabel}>{siteSettings.businessHours}</InfoRow>
              </ul>
              <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                {siteSettings.socialLinks.instagram && (
                  <SocialLink href={siteSettings.socialLinks.instagram} label="Instagram"><InstagramIcon className="h-[18px] w-[18px]" /></SocialLink>
                )}
                {siteSettings.socialLinks.linkedin && (
                  <SocialLink href={siteSettings.socialLinks.linkedin} label="LinkedIn"><LinkedInIcon className="h-[18px] w-[18px]" /></SocialLink>
                )}
                {siteSettings.socialLinks.behance && (
                  <SocialLink href={siteSettings.socialLinks.behance} label="Behance"><BehanceIcon className="h-[18px] w-[18px]" /></SocialLink>
                )}
              </div>
            </div>

            {showMap && (
              <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-soft">
                <iframe
                  title={mapTitle}
                  src={siteSettings.googleMapsUrl}
                  loading="lazy"
                  className="h-72 w-full grayscale-[40%]"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </Reveal>
        </Container>
      </Section>

      {faqs.length > 0 && (
        <Section className="bg-surface">
          <Container className="mx-auto max-w-3xl">
            <SectionHeading eyebrow={t.faqEyebrow} title={t.faqHeading} align="center" className="mx-auto" />
            <Reveal className="mt-12">
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id ?? faq.question} value={faq.id ?? faq.question}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
            <p className="mt-8 text-center text-sm text-muted">
              {t.faqMoreText}{" "}
              <Link href="/faq" className="font-semibold text-secondary hover:underline">
                {t.faqMoreLink}
              </Link>
            </p>
          </Container>
        </Section>
      )}
    </>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <p className="mt-0.5 font-medium text-text">{children}</p>
      </div>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
    >
      {children}
    </Link>
  );
}
