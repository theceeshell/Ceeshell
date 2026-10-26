"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { subscribeNewsletterAction, type NewsletterState } from "@/lib/actions/newsletter-actions";
import { submitKeepingValues } from "@/lib/form-submit";
import type { SiteTexts } from "@/lib/cms/site-texts";

const initialState: NewsletterState = {};

interface NewsletterFormProps {
  dark?: boolean;
  texts: Pick<SiteTexts["newsletter"], "placeholder" | "button" | "success">;
}

export function NewsletterForm({ dark = false, texts }: NewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(subscribeNewsletterAction, initialState);
  const id = React.useId();

  if (state.success) {
    return (
      <p role="status" className={cn("flex items-center gap-2 text-sm font-semibold", dark ? "text-white" : "text-primary")}>
        <Check className="h-4 w-4 text-secondary" /> {texts.success}
      </p>
    );
  }

  return (
    <form onSubmit={submitKeepingValues(formAction)} className="flex flex-col gap-2">
      {/* Honeypot: hidden from people and assistive tech, but bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <Input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={texts.placeholder}
          className={cn(
            dark && "border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20"
          )}
        />
        <Button type="submit" variant={dark ? "light" : "primary"} size="default" className="shrink-0" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {texts.button}
        </Button>
      </div>
      {state.error && (
        <p role="alert" className={cn("text-sm", dark ? "text-red-200" : "text-red-700")}>
          {state.error}
        </p>
      )}
    </form>
  );
}
