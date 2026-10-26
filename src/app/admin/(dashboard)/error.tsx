"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="font-heading text-lg font-medium text-primary">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted">
        This page couldn&apos;t be loaded. Try again, and if it keeps failing, note the reference below.
      </p>
      {error.digest && <p className="font-mono text-xs text-muted">Ref: {error.digest}</p>}
      <Button size="sm" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
