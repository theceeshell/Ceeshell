"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Copy, Loader2, ExternalLink } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteBlogPostAction, duplicateBlogPostAction } from "@/lib/actions/blog-actions";
import { formatDate } from "@/lib/format-date";

export interface BlogRow {
  id: string;
  title: string;
  slug: string;
  featuredImageUrl: string;
  category: string;
  status: string;
  featured: boolean;
  publishDate: Date;
}

export function BlogManager({ posts }: { posts: BlogRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [duplicatingId, setDuplicatingId] = React.useState<string | null>(null);

  function duplicate(row: BlogRow) {
    setDuplicatingId(row.id);
    startTransition(async () => {
      try {
        await duplicateBlogPostAction(row.id);
        toast.success("Post duplicated");
        router.refresh();
      } catch {
        toast.error("Couldn't duplicate this post — please try again.");
      } finally {
        setDuplicatingId(null);
      }
    });
  }

  const columns: DataTableColumn<BlogRow>[] = [
    {
      key: "thumbnail",
      header: "",
      className: "w-20",
      render: (row) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.featuredImageUrl} alt="" className="h-10 w-14 rounded object-cover" />
      ),
    },
    {
      key: "title",
      header: "Title",
      sortValue: (row) => row.title,
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium text-text">{row.title}</p>
          <p className="mt-0.5 truncate text-xs text-muted">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortValue: (row) => row.category,
      render: (row) => row.category,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        row.status !== "published" ? (
          <StatusBadge label="Draft" tone="neutral" />
        ) : new Date(row.publishDate) > new Date() ? (
          <StatusBadge label={`Scheduled · ${formatDate(row.publishDate)}`} tone="blue" />
        ) : (
          <StatusBadge label="Published" tone="green" />
        )
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) =>
        row.featured ? <StatusBadge label="Featured" tone="blue" /> : <span className="text-muted">—</span>,
    },
    {
      key: "publishDate",
      header: "Publish Date",
      sortValue: (row) => row.publishDate.getTime(),
      render: (row) =>
        formatDate(row.publishDate),
    },
  ];

  return (
    <DataTable
      data={posts}
      columns={columns}
      rowKey={(row) => row.id}
      searchPlaceholder="Search posts…"
      searchFn={(row, q) => row.title.toLowerCase().includes(q) || row.category.toLowerCase().includes(q)}
      emptyMessage="No blog posts yet — add your first one."
      actions={(row) => (
        <div className="flex justify-end gap-1.5">
          {row.status === "published" && new Date(row.publishDate) <= new Date() && (
            <a
              aria-label="View on website"
              title="View on website"
              href={`/blog/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Link
            href={`/admin/blog/${row.id}`}
            aria-label="Edit"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            aria-label="Duplicate"
            disabled={pending && duplicatingId === row.id}
            onClick={() => duplicate(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary disabled:opacity-40"
          >
            {pending && duplicatingId === row.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <ConfirmDialog
            trigger={
              <DialogTrigger asChild>
                <button
                  aria-label="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </DialogTrigger>
            }
            title="Delete this post?"
            description="This will remove it from the blog. This can't be undone."
            onConfirm={async () => {
              await deleteBlogPostAction(row.id);
              toast.success("Post deleted");
              router.refresh();
            }}
          />
        </div>
      )}
    />
  );
}
