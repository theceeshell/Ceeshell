"use client";

import { useEffect } from "react";
import { StatusMessage } from "@/components/shared/status-message";
import { Button } from "@/components/ui/button";

export default function MarketingError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusMessage
      eyebrow="Something went wrong"
      title="This page didn't load properly"
      description="Please try again in a moment. If it keeps happening, get in touch and we'll sort it out."
    >
      <Button onClick={() => retry()}>Try again</Button>
    </StatusMessage>
  );
}
