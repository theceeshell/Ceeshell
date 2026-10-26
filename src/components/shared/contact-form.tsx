"use client";

import * as React from "react";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { submitInquiryAction, type InquiryState } from "@/lib/actions/inquiry-actions";
import { submitKeepingValues } from "@/lib/form-submit";
import type { SiteTexts } from "@/lib/cms/site-texts";

const initialState: InquiryState = {};

const ATTACHMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.docx,.pptx";
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

export interface ContactFormOption {
  slug: string;
  label: string;
}

interface ContactFormProps {
  industries: ContactFormOption[];
  services: ContactFormOption[];
  texts: SiteTexts["contactForm"];
}

export function ContactForm({ industries, services, texts: t }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitInquiryAction, initialState);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-border bg-surface px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-secondary" />
        <h3 className="font-heading text-2xl font-medium text-primary">{t.successHeading}</h3>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          {t.successText}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submitKeepingValues(formAction)} className="space-y-8">
      {/* Honeypot: hidden from people and assistive tech, but bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label={t.nameLabel} htmlFor="name">
          <Input id="name" name="name" required placeholder={t.namePlaceholder} />
        </Field>
        <Field label={t.companyLabel} htmlFor="company">
          <Input id="company" name="company" required placeholder={t.companyPlaceholder} />
        </Field>
        <Field label={t.emailLabel} htmlFor="email">
          <Input id="email" name="email" type="email" required placeholder={t.emailPlaceholder} />
        </Field>
        <Field label={t.phoneLabel} htmlFor="phone">
          <Input id="phone" name="phone" type="tel" placeholder={t.phonePlaceholder} />
        </Field>
        <Field label={t.industryLabel} htmlFor="industry">
          <Select name="industry">
            <SelectTrigger id="industry">
              <SelectValue placeholder={t.industryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.slug} value={industry.slug}>
                  {industry.label}
                </SelectItem>
              ))}
              <SelectItem value="other">{t.industryOther}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={t.serviceLabel} htmlFor="service">
          <Select name="service">
            <SelectTrigger id="service">
              <SelectValue placeholder={t.servicePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.slug} value={service.slug}>
                  {service.label}
                </SelectItem>
              ))}
              <SelectItem value="not-sure">{t.serviceNotSure}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={t.budgetLabel} htmlFor="budget">
          <Select name="budget">
            <SelectTrigger id="budget">
              <SelectValue placeholder={t.budgetPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {t.budgets.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t.timelineLabel} htmlFor="timeline">
          <Select name="timeline">
            <SelectTrigger id="timeline">
              <SelectValue placeholder={t.timelinePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {t.timelines.map((timeline) => (
                <SelectItem key={timeline} value={timeline}>
                  {timeline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label={t.messageLabel} htmlFor="description">
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
        />
      </Field>

      <Field label={t.fileLabel} htmlFor="file">
        <label
          htmlFor="file"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-white px-4 py-3.5 text-sm text-muted transition-colors hover:border-secondary"
        >
          <UploadCloud className="h-4 w-4 shrink-0" />
          {fileName ?? t.fileHint}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept={ATTACHMENT_ACCEPT}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > MAX_ATTACHMENT_BYTES) {
              e.target.value = "";
              setFileName(null);
              setFileError("That file is larger than 4 MB. Please attach a smaller file or send it by email.");
              return;
            }
            setFileError(null);
            setFileName(file?.name ?? null);
          }}
        />
        {fileError && <p className="text-sm text-red-700">{fileError}</p>}
      </Field>

      {state.error && (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {t.submit}
      </Button>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
