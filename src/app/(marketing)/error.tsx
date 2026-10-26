"use client";

import { useEffect } from "react";
import { StatusMessage } from "@/components/shared/status-message";
import { Button } from "@/components/ui/button";
import { useErrorTexts } from "@/components/shared/site-texts-provider";

export default function MarketingError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useErrorTexts();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusMessage
      eyebrow={t.eyebrow}
      title={t.heading}
      description={t.text}
    >
      <Button onClick={() => retry()}>{t.retryButton}</Button>
    </StatusMessage>
  );
}
