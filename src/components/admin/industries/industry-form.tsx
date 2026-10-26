"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/ui/form-field";
import { ListInput } from "@/components/admin/ui/list-input";
import { ImageField } from "@/components/admin/media/image-field";
import { slugify } from "@/lib/slug";
import { industrySchema, type IndustryFormValues } from "@/lib/validators/industry";
import { createIndustryAction, updateIndustryAction } from "@/lib/actions/industry-actions";

export interface IndustryFormInitial extends IndustryFormValues {
  id: string;
}

interface IndustryFormProps {
  industry?: IndustryFormInitial;
  projects: { id: string; title: string }[];
}

const EMPTY: IndustryFormValues = {
  name: "",
  slug: "",
  summary: "",
  heroImageUrl: "",
  painPoints: [""],
  solutions: [""],
  projectIds: [],
  visible: true,
  seoTitle: "",
  seoDescription: "",
};

export function IndustryForm({ industry, projects }: IndustryFormProps) {
  const router = useRouter();
  const isEditing = Boolean(industry);
  const [slugTouched, setSlugTouched] = React.useState(isEditing);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IndustryFormValues>({ resolver: zodResolver(industrySchema), defaultValues: industry ?? EMPTY });

  const name = useWatch({ control, name: "name" });
  React.useEffect(() => {
    if (!slugTouched) setValue("slug", slugify(name || ""));
  }, [name, slugTouched, setValue]);

  async function onSubmit(raw: IndustryFormValues) {
    const values = {
      ...raw,
      painPoints: raw.painPoints.filter((v) => v.trim()),
      solutions: raw.solutions.filter((v) => v.trim()),
    };
    try {
      const result = industry ? await updateIndustryAction(industry.id, values) : await createIndustryAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(industry ? "Industry updated" : "Industry created");
      router.push("/admin/industries");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6">
      <Card title="Basics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} placeholder="Food & Beverage" />
          </FormField>
          <FormField
            label="Web address"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Filled in from the name. The page will be at /industries/this-address"
          >
            <Input id="slug" {...register("slug", { onChange: () => setSlugTouched(true) })} />
          </FormField>
        </div>
        <FormField label="Summary" htmlFor="summary" error={errors.summary?.message} hint="One or two sentences shown on cards and under the page title.">
          <Textarea id="summary" rows={3} {...register("summary")} />
        </FormField>
        <Controller
          control={control}
          name="heroImageUrl"
          render={({ field }) => (
            <ImageField
              label="Banner photo or video"
              value={field.value}
              onChange={field.onChange}
              error={errors.heroImageUrl?.message}
              allowVideo
            />
          )}
        />
        <Controller
          control={control}
          name="visible"
          render={({ field }) => (
            <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
              <span>
                <span className="block text-sm font-semibold text-primary">Show on website</span>
                <span className="block text-xs text-muted">Turn off to hide it from the website without deleting it.</span>
              </span>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </label>
          )}
        />
      </Card>

      <Card title="Page content">
        <FormField label="Challenges in this industry" htmlFor="painPoints">
          <Controller
            control={control}
            name="painPoints"
            render={({ field }) => <ListInput id="painPoints" values={field.value} onChange={field.onChange} addLabel="Add challenge" />}
          />
        </FormField>
        <FormField label="How you solve them" htmlFor="solutions">
          <Controller
            control={control}
            name="solutions"
            render={({ field }) => <ListInput id="solutions" values={field.value} onChange={field.onChange} addLabel="Add solution" />}
          />
        </FormField>
        <FormField label="Projects to show" htmlFor="projects" hint="Tick the portfolio projects that belong to this industry.">
          <Controller
            control={control}
            name="projectIds"
            render={({ field }) => (
              <div id="projects" className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-border p-3 sm:grid-cols-2">
                {projects.length === 0 && <p className="text-sm text-muted">No portfolio projects yet.</p>}
                {projects.map((project) => (
                  <label key={project.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-background">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--color-secondary)]"
                      checked={field.value.includes(project.id)}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? [...field.value, project.id] : field.value.filter((id) => id !== project.id))
                      }
                    />
                    {project.title}
                  </label>
                ))}
              </div>
            )}
          />
        </FormField>
      </Card>

      <Card title="Search engines (optional)">
        <FormField label="SEO title" htmlFor="seoTitle" hint="Leave empty to use the industry name.">
          <Input id="seoTitle" {...register("seoTitle")} />
        </FormField>
        <FormField label="SEO description" htmlFor="seoDescription" hint="Leave empty to use the summary.">
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
        </FormField>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={() => router.push("/admin/industries")}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Save changes" : "Create industry"}
        </Button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
      <h2 className="font-heading text-lg font-medium text-primary">{title}</h2>
      {children}
    </section>
  );
}
