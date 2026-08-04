import Link from "next/link";
import { ArrowRight, FileStack } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata = { title: "Content Manager" };

export default async function ContentManagerPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "asc" },
    include: { sections: { select: { id: true, enabled: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Content Manager"
        description="Every page on the site is built from sections. Open a page to enable, disable, reorder, edit or add sections."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const enabledCount = page.sections.filter((s) => s.enabled).length;
          return (
            <Link
              key={page.id}
              href={`/admin/content/${page.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-white p-6 transition-colors hover:border-secondary/40"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <FileStack className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-medium text-primary">{page.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{page.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  {enabledCount} / {page.sections.length} sections enabled
                </span>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
