"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import {
  footerConfigSchema,
  type FooterConfigFormValues,
  type FooterConfigFormInput,
} from "@/lib/validators/footer";
import { updateFooterConfigAction } from "@/lib/actions/footer-actions";

interface FooterConfigFormProps {
  initialValues: FooterConfigFormValues;
}

type FooterForm = ReturnType<typeof useForm<FooterConfigFormInput, unknown, FooterConfigFormValues>>;

function LinkListSection({
  title,
  description,
  name,
  control,
  register,
  errors,
}: {
  title: string;
  description: string;
  name: "quickLinks" | "serviceLinks";
  control: FooterForm["control"];
  register: FooterForm["register"];
  errors: FooterForm["formState"]["errors"];
}) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
      <div>
        <h3 className="font-heading text-lg font-medium text-primary">{title}</h3>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>

      <div className="space-y-4">
        {fields.length === 0 && <p className="text-sm text-muted">No links yet — add one below.</p>}
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-start">
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Label"
                htmlFor={`${name}.${index}.label`}
                error={errors[name]?.[index]?.label?.message}
              >
                <Input id={`${name}.${index}.label`} {...register(`${name}.${index}.label` as const)} placeholder="Home" />
              </FormField>
              <FormField
                label="Link"
                htmlFor={`${name}.${index}.href`}
                error={errors[name]?.[index]?.href?.message}
              >
                <Input id={`${name}.${index}.href`} {...register(`${name}.${index}.href` as const)} placeholder="/" />
              </FormField>
            </div>
            <button
              type="button"
              aria-label="Remove link"
              onClick={() => remove(index)}
              className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-lg text-muted hover:bg-red-50 hover:text-red-600 sm:mt-7"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button type="button" variant="secondary" size="sm" onClick={() => append({ label: "", href: "" })}>
        <Plus className="h-4 w-4" /> Add Link
      </Button>
    </section>
  );
}

export function FooterConfigForm({ initialValues }: FooterConfigFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FooterConfigFormInput, unknown, FooterConfigFormValues>({
    resolver: zodResolver(footerConfigSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: FooterConfigFormValues) {
    try {
      await updateFooterConfigAction(values);
      toast.success("Footer updated");
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">General</h3>
        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={3} {...register("description")} placeholder="A short description shown in the footer." />
        </FormField>
        <FormField label="Copyright Text" htmlFor="copyrightText" error={errors.copyrightText?.message}>
          <Input id="copyrightText" {...register("copyrightText")} placeholder="© 2026 Cee-Shell. All rights reserved." />
        </FormField>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Privacy Policy Link" htmlFor="privacyPolicyHref" error={errors.privacyPolicyHref?.message}>
            <Input id="privacyPolicyHref" {...register("privacyPolicyHref")} placeholder="/privacy-policy" />
          </FormField>
          <FormField label="Terms Link" htmlFor="termsHref" error={errors.termsHref?.message}>
            <Input id="termsHref" {...register("termsHref")} placeholder="/terms" />
          </FormField>
        </div>
      </section>

      <LinkListSection
        title="Quick Links"
        description="Shown in the footer's Quick Links column."
        name="quickLinks"
        control={control}
        register={register}
        errors={errors}
      />

      <LinkListSection
        title="Service Links"
        description="Shown in the footer's Services column."
        name="serviceLinks"
        control={control}
        register={register}
        errors={errors}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
