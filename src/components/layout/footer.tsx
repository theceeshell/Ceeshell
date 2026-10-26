import Link from "next/link";
import { InstagramIcon, LinkedInIcon, BehanceIcon } from "@/components/shared/social-icons";
import { Logo } from "@/components/shared/logo";
import { ShellMotif } from "@/components/shared/shell-motif";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import type { SiteTexts } from "@/lib/cms/site-texts";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  websiteName: string;
  description: string;
  socialLinks: { instagram?: string; linkedin?: string; behance?: string };
  quickLinks: FooterLink[];
  serviceLinks: FooterLink[];
  copyrightText: string;
  privacyPolicyHref: string;
  termsHref: string;
  logoUrl?: string | null;
  texts: SiteTexts["footer"];
  newsletterTexts: SiteTexts["newsletter"];
}

export function Footer({
  websiteName,
  description,
  socialLinks,
  quickLinks,
  serviceLinks,
  copyrightText,
  privacyPolicyHref,
  termsHref,
  logoUrl,
  texts,
  newsletterTexts,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-primary text-white">
      <ShellMotif
        size={520}
        className="pointer-events-none absolute -right-24 -top-24 text-white/[0.05]"
      />
      <div className="container-agency relative py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={websiteName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <Logo className="h-8 w-8 text-white" />
              )}
              <span className="font-heading text-2xl font-medium">{websiteName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/65">{description}</p>
            <div className="flex items-center gap-4 pt-1">
              {socialLinks.instagram && (
                <SocialLink href={socialLinks.instagram} label="Instagram">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </SocialLink>
              )}
              {socialLinks.linkedin && (
                <SocialLink href={socialLinks.linkedin} label="LinkedIn">
                  <LinkedInIcon className="h-[18px] w-[18px]" />
                </SocialLink>
              )}
              {socialLinks.behance && (
                <SocialLink href={socialLinks.behance} label="Behance">
                  <BehanceIcon className="h-[18px] w-[18px]" />
                </SocialLink>
              )}
            </div>
          </div>

          <FooterColumn title={texts.linksColumnTitle} links={quickLinks} />
          <FooterColumn title={texts.servicesColumnTitle} links={serviceLinks} />

          <div className="space-y-5">
            <h3 className="font-heading text-lg font-medium text-white">{texts.newsletterHeading}</h3>
            <p className="text-sm leading-relaxed text-white/65">
              {texts.newsletterText}
            </p>
            <NewsletterForm dark texts={newsletterTexts} />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {copyrightText}</p>
          <div className="flex gap-6">
            <Link href={privacyPolicyHref} className="hover:text-white">
              {texts.privacyLabel}
            </Link>
            <Link href={termsHref} className="hover:text-white">
              {texts.termsLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="space-y-5">
      <h3 className="font-heading text-lg font-medium text-white">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/65 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-primary"
    >
      {children}
    </Link>
  );
}
