import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { isSystemPage, SYSTEM_PAGE_SLUGS } from "@/lib/cms/pages";
import { PageHeader } from "@/components/admin/ui/page-header";
import { PageList } from "@/components/admin/pages/page-list";

export const metadata = { title: "Pages" };

export default async function ContentManagerPagesPage() {
  const [session, pages] = await Promise.all([
    getSession(),
    prisma.page.findMany({
      orderBy: { createdAt: "asc" },
      include: { sections: { select: { enabled: true } } },
    }),
  ]);

  // Main pages first, in menu order, then custom pages.
  const rank = (slug: string) => {
    const index = (SYSTEM_PAGE_SLUGS as readonly string[]).indexOf(slug);
    return index === -1 ? SYSTEM_PAGE_SLUGS.length : index;
  };
  const sorted = [...pages].sort((a, b) => rank(a.slug) - rank(b.slug));

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Every page is built from sections. Open a page to edit its content, or create a new page."
      />
      <PageList
        canManage={session?.role === "ADMIN"}
        pages={sorted.map((page) => ({
          id: page.id,
          title: page.title,
          description: page.description,
          slug: page.slug,
          system: isSystemPage(page.slug),
          sectionCount: page.sections.length,
          enabledCount: page.sections.filter((s) => s.enabled).length,
        }))}
      />
    </div>
  );
}
