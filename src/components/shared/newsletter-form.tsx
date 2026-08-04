"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <p className={cn("flex items-center gap-2 text-sm font-semibold", dark ? "text-white" : "text-primary")}>
        <Check className="h-4 w-4 text-secondary" /> You&apos;re subscribed. Welcome aboard.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Input
        type="email"
        required
        placeholder="Your email"
        className={cn(
          dark && "border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20"
        )}
      />
      <Button type="submit" variant={dark ? "light" : "primary"} size="default" className="shrink-0">
        Subscribe
      </Button>
    </form>
  );
}
