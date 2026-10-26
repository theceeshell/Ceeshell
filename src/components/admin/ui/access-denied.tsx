import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";

export function AccessDenied({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <p className="font-heading text-lg font-medium text-primary">Access denied</p>
        <p className="max-w-sm text-sm text-muted">You need administrator access to view this page.</p>
      </div>
    </div>
  );
}
