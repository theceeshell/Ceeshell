import { DatabaseBackup, Download } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Backup" };

const DESCRIPTION = "Download a copy of all website content.";

export default async function BackupPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return <AccessDenied title="Backup" description={DESCRIPTION} />;

  return (
    <div>
      <PageHeader title="Backup" description={DESCRIPTION} />
      <div className="max-w-2xl rounded-2xl border border-border bg-white p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
          <DatabaseBackup className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-heading text-xl font-medium text-primary">Keep a copy of your website</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The free database plan doesn&apos;t keep backups for you. Download a backup file every month (and before any big
          change) and keep it somewhere safe, like Google Drive. It contains all pages, services, projects, blog posts,
          inquiries, subscribers and settings. Images stay in your Media Library and are linked from the file.
        </p>
        <Button asChild className="mt-6">
          <a href="/admin/backup/download" download>
            <Download className="h-4 w-4" /> Download backup
          </a>
        </Button>
      </div>
    </div>
  );
}
