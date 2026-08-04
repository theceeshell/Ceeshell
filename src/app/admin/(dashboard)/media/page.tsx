import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { MediaLibrary } from "@/components/admin/media/media-library";

export const metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  const folders = Array.from(new Set(media.map((m) => m.folder))).sort();

  return (
    <div>
      <PageHeader title="Media Library" description="Upload and manage images used across the website." />
      <MediaLibrary media={media} folders={folders} />
    </div>
  );
}
