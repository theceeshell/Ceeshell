import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getReferenceOptions } from "@/lib/cms/reference-options";
import { PageHeader } from "@/components/admin/ui/page-header";
import { ContentManager } from "@/components/admin/content/content-manager";

export default async function ContentManagerSectionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!page) notFound();

  const referenceOptions = await getReferenceOptions();

  return (
    <div>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> All Pages
      </Link>
      <PageHeader title={page.title} description={page.description} />
      <ContentManager
        pageSlug={page.slug}
        pageTitle={page.title}
        sections={page.sections.map((s) => ({ id: s.id, type: s.type, name: s.name, content: s.content, enabled: s.enabled }))}
        referenceOptions={referenceOptions}
      />
    </div>
  );
}
