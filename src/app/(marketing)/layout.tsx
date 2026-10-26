import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/shared/motion-provider";
import { getSiteSettings, getFooterConfig, getNavigationItems } from "@/lib/cms/site-data";
import { jsonLd } from "@/lib/cms/html";
import { siteConfig } from "@/lib/site-config";

// Public pages are statically rendered and served from Vercel's cache. Admin
// edits purge them on demand (revalidateSite()); this is only a daily safety net.
export const revalidate = 86400;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [settings, footer, navItems] = await Promise.all([getSiteSettings(), getFooterConfig(), getNavigationItems()]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.companyName,
    url: siteConfig.url,
    description: settings.defaultSeoDescription,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
    },
    sameAs: Object.values(settings.socialLinks).filter(Boolean),
  };

  return (
    <MotionProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar
        websiteName={settings.websiteName}
        navItems={navItems}
        email={settings.email}
        phone={settings.phone}
        logoUrl={settings.logoUrl}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        websiteName={settings.websiteName}
        description={footer.description}
        socialLinks={settings.socialLinks}
        quickLinks={footer.quickLinks}
        serviceLinks={footer.serviceLinks}
        copyrightText={footer.copyrightText}
        privacyPolicyHref={footer.privacyPolicyHref}
        termsHref={footer.termsHref}
        logoUrl={settings.footerLogoUrl ?? settings.logoUrl}
      />
    </MotionProvider>
  );
}
