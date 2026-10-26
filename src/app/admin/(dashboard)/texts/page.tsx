import { getSession } from "@/lib/auth/session";
import { getSiteTexts } from "@/lib/cms/site-data";
import { getLinkOptions } from "@/lib/cms/link-options";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { SiteTextsForm } from "@/components/admin/texts/site-texts-form";

export const metadata = { title: "Website Texts" };

const DESCRIPTION = "Buttons, labels, form fields and other fixed wording used across the website.";

export default async function AdminTextsPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return <AccessDenied title="Website Texts" description={DESCRIPTION} />;
  }

  return (
    <div>
      <PageHeader title="Website Texts" description={DESCRIPTION} />
      <SiteTextsForm initial={await getSiteTexts()} linkOptions={await getLinkOptions()} />
    </div>
  );
}
