"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  deletePortfolioProjectAction,
  duplicatePortfolioProjectAction,
  reorderPortfolioProjectsAction,
} from "@/lib/actions/portfolio-actions";

export interface PortfolioProjectRow {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: string;
  categories: string[];
  servicesUsed: string[];
  excerpt: string;
  coverImageUrl: string;
  coverAspect: string;
  gallery: string[];
  challenge: string;
  research: string;
  strategy: string;
  concept: string;
  designProcess: string;
  photography: string;
  printing: string;
  deliverables: string[];
  testimonialId: string | null;
  industryIds: string[];
  featured: boolean;
  visible: boolean;
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
}

export function PortfolioManager({ projects }: { projects: PortfolioProjectRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function move(row: PortfolioProjectRow, direction: -1 | 1) {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((p) => p.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderPortfolioProjectsAction(sorted.map((p) => p.id));
      router.refresh();
    });
  }

  const columns: DataTableColumn<PortfolioProjectRow>[] = [
    {
      key: "title",
      header: "Project",
      sortValue: (row) => row.title,
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.coverImageUrl || "https://images.unsplash.com/photo-1557821552-17105176677c?w=100"}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
          />
          <div className="max-w-xs">
            <p className="font-medium text-text">{row.title}</p>
            <p className="truncate text-xs text-muted">
              {row.client} &middot; {row.year}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "categories",
      header: "Categories",
      render: (row) => (
        <div className="flex max-w-[16rem] flex-wrap gap-1">
          {row.categories.slice(0, 3).map((category) => (
            <StatusBadge key={category} label={category} tone="blue" />
          ))}
          {row.categories.length > 3 && <StatusBadge label={`+${row.categories.length - 3}`} tone="neutral" />}
        </div>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <StatusBadge label={row.featured ? "Featured" : "Standard"} tone={row.featured ? "amber" : "neutral"} />
          {!row.visible && <StatusBadge label="Hidden" tone="red" />}
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      className: "w-28",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            aria-label="Move up"
            disabled={pending}
            onClick={() => move(row, -1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-primary disabled:opacity-40"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Move down"
            disabled={pending}
            onClick={() => move(row, 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-primary disabled:opacity-40"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button size="sm" asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search projects…"
        searchFn={(row, q) => row.title.toLowerCase().includes(q) || row.client.toLowerCase().includes(q)}
        emptyMessage="No portfolio projects yet — add your first one."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            {row.visible && (
              <a
                aria-label="View on website"
                title="View on website"
                href={`/portfolio/${row.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Link
              aria-label="Edit"
              href={`/admin/portfolio/${row.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              aria-label="Duplicate"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await duplicatePortfolioProjectAction(row.id);
                  toast.success("Project duplicated");
                  router.refresh();
                })
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary disabled:opacity-40"
            >
              <Copy className="h-4 w-4" />
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
              title="Delete this project?"
              description="This removes it from the portfolio and any pages that reference it. This can't be undone."
              onConfirm={async () => {
                await deletePortfolioProjectAction(row.id);
                toast.success("Project deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
