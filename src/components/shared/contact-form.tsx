"use client";

import * as React from "react";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { submitInquiryAction, type InquiryState } from "@/lib/actions/inquiry-actions";

const budgets = [
  "Under PKR 150,000",
  "PKR 150,000 – 500,000",
  "PKR 500,000 – 1,500,000",
  "PKR 1,500,000 – 4,000,000",
  "PKR 4,000,000+",
];
const timelines = ["As soon as possible", "Within 1 month", "1 – 3 months", "3 – 6 months", "Flexible / exploring"];

const initialState: InquiryState = {};

export interface ContactFormOption {
  slug: string;
  label: string;
}

interface ContactFormProps {
  industries: ContactFormOption[];
  services: ContactFormOption[];
}

export function ContactForm({ industries, services }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitInquiryAction, initialState);
  const [fileName, setFileName] = React.useState<string | null>(null);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-border bg-surface px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-secondary" />
        <h3 className="font-heading text-2xl font-medium text-primary">Thank you — your inquiry is in.</h3>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          We review every submission personally and typically respond within 2 business days with next steps.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name">
          <Input id="name" name="name" required placeholder="Jane Cooper" />
        </Field>
        <Field label="Company" htmlFor="company">
          <Input id="company" name="company" required placeholder="Your company name" />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" placeholder="+92 3__ _______" />
        </Field>
        <Field label="Industry" htmlFor="industry">
          <Select name="industry">
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.slug} value={industry.slug}>
                  {industry.label}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Required Service" htmlFor="service">
          <Select name="service">
            <SelectTrigger id="service">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.slug} value={service.slug}>
                  {service.label}
                </SelectItem>
              ))}
              <SelectItem value="not-sure">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Budget Range" htmlFor="budget">
          <Select name="budget">
            <SelectTrigger id="budget">
              <SelectValue placeholder="Select a budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Timeline" htmlFor="timeline">
          <Select name="timeline">
            <SelectTrigger id="timeline">
              <SelectValue placeholder="Select your timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Project Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Tell us about your brand, your goals and what you're looking to achieve."
        />
      </Field>

      <Field label="Reference Files (optional)" htmlFor="file">
        <label
          htmlFor="file"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-white px-4 py-3.5 text-sm text-muted transition-colors hover:border-secondary"
        >
          <UploadCloud className="h-4 w-4 shrink-0" />
          {fileName ?? "Attach a brief, brand deck or reference images"}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </Field>

      {state.error && (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Inquiry
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
