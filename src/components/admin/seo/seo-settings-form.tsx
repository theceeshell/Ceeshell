"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormField } from "@/components/admin/ui/form-field";
import { seoSettingsSchema, type SeoSettingsFormValues } from "@/lib/validators/site-settings";
import { updateSeoSettingsAction } from "@/lib/actions/site-settings-actions";

interface SeoSettingsFormProps {
  initialValues: SeoSettingsFormValues;
}

export function SeoSettingsForm({ initialValues }: SeoSettingsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SeoSettingsFormValues>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: SeoSettingsFormValues) {
    try {
      await updateSeoSettingsAction(values);
      toast.success("SEO settings updated");
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Search & Social Defaults</h3>

        <FormField label="Default SEO Title" htmlFor="defaultSeoTitle" error={errors.defaultSeoTitle?.message}>
          <Input id="defaultSeoTitle" {...register("defaultSeoTitle")} placeholder="Cee-Shell — Creative Agency" />
        </FormField>

        <FormField
          label="Default SEO Description"
          htmlFor="defaultSeoDescription"
          error={errors.defaultSeoDescription?.message}
        >
          <Textarea
            id="defaultSeoDescription"
            rows={3}
            {...register("defaultSeoDescription")}
            placeholder="A short description used when a page doesn't set its own."
          />
        </FormField>

        <FormField
          label="Default OG Image URL"
          htmlFor="defaultOgImageUrl"
          error={errors.defaultOgImageUrl?.message}
          hint="Paste a URL from the Media Library."
        >
          <Input id="defaultOgImageUrl" {...register("defaultOgImageUrl")} placeholder="https://…" />
        </FormField>

        <FormField label="Twitter Card Type" htmlFor="twitterCardType" error={errors.twitterCardType?.message}>
          <Controller
            control={control}
            name="twitterCardType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="twitterCardType">
                  <SelectValue placeholder="Select a card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">summary</SelectItem>
                  <SelectItem value="summary_large_image">summary_large_image</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label="Google Verification Code"
          htmlFor="googleVerification"
          error={errors.googleVerification?.message}
          hint="Google Search Console verification code, if you have one."
        >
          <Input id="googleVerification" {...register("googleVerification")} placeholder="abc123…" />
        </FormField>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <div>
            <Label htmlFor="robotsIndex">Allow search engines to index this site</Label>
          </div>
          <Controller
            control={control}
            name="robotsIndex"
            render={({ field }) => (
              <Switch id="robotsIndex" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <div>
            <Label htmlFor="robotsFollow">Allow search engines to follow links on this site</Label>
          </div>
          <Controller
            control={control}
            name="robotsFollow"
            render={({ field }) => (
              <Switch id="robotsFollow" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
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
