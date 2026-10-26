import { StatusMessage } from "@/components/shared/status-message";
import { getSiteTexts } from "@/lib/cms/site-data";

export default async function NotFound() {
  const { notFound: t } = await getSiteTexts();
  return (
    <StatusMessage
      eyebrow={t.eyebrow}
      title={t.heading}
      description={t.text}
      homeLabel={t.homeButton}
      contactLabel={t.contactButton}
    />
  );
}
