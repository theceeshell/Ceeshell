import type { Metadata } from "next";
import "./globals.css";
import { cormorant, inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/cms/site-data";

export async function generateMetadata(): Promise<Metadata> {
  // This runs on every request across the whole app (admin included) since it's
  // in the root layout. A transient DB error here must never take the site down,
  // so fall back to the static siteConfig defaults instead of throwing.
  const settings = await getSiteSettings().catch(() => null);
  const websiteName = settings?.websiteName ?? siteConfig.name;
  const tagline = settings?.tagline ?? siteConfig.tagline;
  const description = settings?.defaultSeoDescription ?? siteConfig.description;
  const title = `${websiteName} — ${tagline}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s — ${websiteName}`,
    },
    description,
    keywords: [
      "branding agency",
      "packaging design",
      "commercial photography",
      "graphic design studio",
      "print design",
      "corporate gifts",
    ],
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: websiteName,
      title,
      description,
    },
    twitter: {
      card: (settings?.twitterCardType as "summary" | "summary_large_image") ?? "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: siteConfig.url,
    },
    robots: {
      index: settings?.robotsIndex ?? true,
      follow: settings?.robotsFollow ?? true,
    },
    verification: settings?.googleVerification ? { google: settings.googleVerification } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-text">{children}</body>
    </html>
  );
}
