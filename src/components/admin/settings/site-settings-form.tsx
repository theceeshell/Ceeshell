"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { siteSettingsSchema, type SiteSettingsFormValues } from "@/lib/validators/site-settings";
import { updateSiteSettingsAction } from "@/lib/actions/site-settings-actions";

interface SiteSettingsFormProps {
  initialValues: SiteSettingsFormValues;
}

const socialFields: { key: keyof SiteSettingsFormValues["socialLinks"]; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/…" },
  { key: "behance", label: "Behance", placeholder: "https://behance.net/…" },
  { key: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/…" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/…" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@…" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@…" },
];

export function SiteSettingsForm({ initialValues }: SiteSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: SiteSettingsFormValues) {
    try {
      await updateSiteSettingsAction(values);
      toast.success("Settings updated");
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Business Information</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Website Name" htmlFor="websiteName" error={errors.websiteName?.message}>
            <Input id="websiteName" {...register("websiteName")} placeholder="Cee-Shell" />
          </FormField>
          <FormField label="Company Name" htmlFor="companyName" error={errors.companyName?.message}>
            <Input id="companyName" {...register("companyName")} placeholder="Cee-Shell Creative Agency" />
          </FormField>
        </div>
        <FormField label="Tagline" htmlFor="tagline" error={errors.tagline?.message}>
          <Input id="tagline" {...register("tagline")} placeholder="Design that moves your brand forward" />
        </FormField>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Contact & Hours</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} placeholder="hello@ceeshell.com" />
          </FormField>
          <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" {...register("phone")} placeholder="+92 300 1234567" />
          </FormField>
          <FormField label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.message}>
            <Input id="whatsapp" {...register("whatsapp")} placeholder="+92 300 1234567" />
          </FormField>
          <FormField label="Business Hours" htmlFor="businessHours" error={errors.businessHours?.message}>
            <Input id="businessHours" {...register("businessHours")} placeholder="Mon–Fri, 9am–6pm" />
          </FormField>
        </div>
        <FormField label="Address" htmlFor="address" error={errors.address?.message}>
          <Textarea id="address" rows={3} {...register("address")} placeholder="Where the studio is located" />
        </FormField>
        <FormField
          label="Google Maps URL"
          htmlFor="googleMapsUrl"
          error={errors.googleMapsUrl?.message}
          hint="A Google Maps embed URL, e.g. https://www.google.com/maps?q=...&output=embed"
        >
          <Input id="googleMapsUrl" {...register("googleMapsUrl")} placeholder="https://www.google.com/maps?q=...&output=embed" />
        </FormField>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Social Links</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {socialFields.map(({ key, label, placeholder }) => (
            <FormField
              key={key}
              label={label}
              htmlFor={`socialLinks.${key}`}
              error={errors.socialLinks?.[key]?.message}
            >
              <Input id={`socialLinks.${key}`} {...register(`socialLinks.${key}`)} placeholder={placeholder} />
            </FormField>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Branding</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField
            label="Logo URL"
            htmlFor="logoUrl"
            error={errors.logoUrl?.message}
            hint="Paste a URL from the Media Library."
          >
            <Input id="logoUrl" {...register("logoUrl")} placeholder="https://…" />
          </FormField>
          <FormField
            label="Footer Logo URL"
            htmlFor="footerLogoUrl"
            error={errors.footerLogoUrl?.message}
            hint="Paste a URL from the Media Library."
          >
            <Input id="footerLogoUrl" {...register("footerLogoUrl")} placeholder="https://…" />
          </FormField>
          <FormField
            label="Favicon URL"
            htmlFor="faviconUrl"
            error={errors.faviconUrl?.message}
            hint="Paste a URL from the Media Library."
          >
            <Input id="faviconUrl" {...register("faviconUrl")} placeholder="https://…" />
          </FormField>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
