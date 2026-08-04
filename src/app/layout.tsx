import type { Metadata } from "next";
import "./globals.css";
import { cormorant, inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/cms/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.websiteName} — ${settings.tagline}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s — ${settings.websiteName}`,
    },
    description: settings.defaultSeoDescription,
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
      siteName: settings.websiteName,
      title,
      description: settings.defaultSeoDescription,
    },
    twitter: {
      card: (settings.twitterCardType as "summary" | "summary_large_image") ?? "summary_large_image",
      title,
      description: settings.defaultSeoDescription,
    },
    alternates: {
      canonical: siteConfig.url,
    },
    robots: {
      index: settings.robotsIndex,
      follow: settings.robotsFollow,
    },
    verification: settings.googleVerification ? { google: settings.googleVerification } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-text">{children}</body>
    </html>
  );
}
