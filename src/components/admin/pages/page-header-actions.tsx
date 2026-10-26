"use client";

import * as React from "react";
import { ExternalLink, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSettingsDialog, type PageSettings } from "@/components/admin/pages/page-settings-dialog";
import { pagePath } from "@/lib/cms/pages";

export function PageHeaderActions({ page, canManage }: { page: PageSettings; canManage: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" asChild>
        <a href={pagePath(page.slug)} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" /> View on website
        </a>
      </Button>
      {canManage && (
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          <Settings2 className="h-4 w-4" /> Page settings
        </Button>
      )}
      <PageSettingsDialog open={open} onOpenChange={setOpen} page={page} />
    </div>
  );
}
