"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/ui/form-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import {
  portfolioFormSchema,
  type PortfolioFormShape,
  PORTFOLIO_CATEGORIES,
  COVER_ASPECT_OPTIONS,
} from "@/lib/validators/portfolio";
import { createPortfolioProjectAction, updatePortfolioProjectAction } from "@/lib/actions/portfolio-actions";
import type { PortfolioProjectRow } from "@/components/admin/portfolio/portfolio-manager";

interface PortfolioFormProps {
  initialValues?: PortfolioProjectRow | null;
  industries: { id: string; name: string }[];
  testimonials: { id: string; label: string }[];
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyValues: PortfolioFormShape = {
  slug: "",
  title: "",
  client: "",
  industry: "",
  year: String(new Date().getFullYear()),
  categories: [],
  servicesUsed: [],
  excerpt: "",
  coverImageUrl: "",
  coverAspect: "landscape",
  gallery: [],
  challenge: "",
  research: "",
  strategy: "",
  concept: "",
  designProcess: "",
  photography: "",
  printing: "",
  deliverables: [],
  testimonialId: "none",
  industryIds: [],
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

function toFormShape(row: PortfolioProjectRow | null | undefined): PortfolioFormShape {
  if (!row) return emptyValues;
  return {
    slug: row.slug,
    title: row.title,
    client: row.client,
    industry: row.industry,
    year: row.year,
    categories: row.categories,
    servicesUsed: row.servicesUsed,
    excerpt: row.excerpt,
    coverImageUrl: row.coverImageUrl,
    coverAspect: row.coverAspect as PortfolioFormShape["coverAspect"],
    gallery: row.gallery.map((url) => ({ url })),
    challenge: row.challenge,
    research: row.research,
    strategy: row.strategy,
    concept: row.concept,
    designProcess: row.designProcess,
    photography: row.photography,
    printing: row.printing,
    deliverables: row.deliverables,
    testimonialId: row.testimonialId ?? "none",
    industryIds: row.industryIds,
    featured: row.featured,
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
  };
}

export function PortfolioForm({ initialValues, industries, testimonials }: PortfolioFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialValues);
  const [slugTouched, setSlugTouched] = React.useState(isEditing);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioFormShape>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: toFormShape(initialValues),
  });

  const galleryArray = useFieldArray({ control, name: "gallery" });

  const title = useWatch({ control, name: "title" });
  React.useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(title || ""), { shouldValidate: Boolean(title) });
    }
  }, [title, slugTouched, setValue]);

  const selectedCategories = useWatch({ control, name: "categories" });
  const selectedIndustryIds = useWatch({ control, name: "industryIds" });

  function toggleCategory(category: string, checked: boolean) {
    const current = selectedCategories;
    setValue("categories", checked ? [...current, category] : current.filter((c) => c !== category), {
      shouldValidate: true,
    });
  }

  function toggleIndustry(id: string, checked: boolean) {
    const current = selectedIndustryIds;
    setValue("industryIds", checked ? [...current, id] : current.filter((i) => i !== id));
  }

  async function onSubmit(values: PortfolioFormShape) {
    const payload = {
      ...values,
      gallery: values.gallery.map((item) => item.url).filter(Boolean),
      testimonialId: values.testimonialId === "none" ? null : values.testimonialId,
    };
    try {
      const result = isEditing && initialValues
        ? await updatePortfolioProjectAction(initialValues.id, payload)
        : await createPortfolioProjectAction(payload);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isEditing ? "Project updated" : "Project created");
      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6">
      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Basics</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={errors.title?.message}>
            <Input id="title" {...register("title")} placeholder="Aurum Skincare Rebrand" />
          </FormField>
          <FormField
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Used in the project URL. Auto-generated from the title until you edit it."
          >
            <Input
              id="slug"
              {...register("slug", { onChange: () => setSlugTouched(true) })}
              placeholder="aurum-skincare-rebrand"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="Client" htmlFor="client" error={errors.client?.message}>
            <Input id="client" {...register("client")} placeholder="Aurum Skincare" />
          </FormField>
          <FormField label="Industry" htmlFor="industry" error={errors.industry?.message}>
            <Input id="industry" {...register("industry")} placeholder="Beauty & Cosmetics" />
          </FormField>
          <FormField label="Year" htmlFor="year" error={errors.year?.message}>
            <Input id="year" {...register("year")} placeholder="2025" />
          </FormField>
        </div>
        <FormField
          label="Excerpt"
          htmlFor="excerpt"
          error={errors.excerpt?.message}
          hint="A one or two sentence summary shown on the portfolio grid."
        >
          <Textarea id="excerpt" rows={3} {...register("excerpt")} placeholder="A short summary of the project…" />
        </FormField>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Cover Image URL" htmlFor="coverImageUrl" error={errors.coverImageUrl?.message}>
            <Input id="coverImageUrl" {...register("coverImageUrl")} placeholder="https://…" />
          </FormField>
          <FormField label="Cover Aspect" htmlFor="coverAspect" error={errors.coverAspect?.message}>
            <Controller
              control={control}
              name="coverAspect"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="coverAspect">
                    <SelectValue placeholder="Select aspect" />
                  </SelectTrigger>
                  <SelectContent>
                    {COVER_ASPECT_OPTIONS.map((aspect) => (
                      <SelectItem key={aspect} value={aspect}>
                        {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <div>
            <Label htmlFor="featured">Featured</Label>
            <p className="mt-0.5 text-xs text-muted">Featured projects are highlighted across the site.</p>
          </div>
          <Controller
            control={control}
            name="featured"
            render={({ field }) => <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Categorization</h3>
        <div className="space-y-2">
          <Label>Categories</Label>
          <p className="text-xs text-muted">The public portfolio filters match these exactly — pick from the fixed list.</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {PORTFOLIO_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-text"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => toggleCategory(category, e.target.checked)}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary/30"
                />
                {category}
              </label>
            ))}
          </div>
          {errors.categories?.message && (
            <p className="text-xs font-medium text-red-600">{errors.categories.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Services Used</Label>
          <Controller
            control={control}
            name="servicesUsed"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Packaging Design" />
            )}
          />
        </div>

        {industries.length > 0 && (
          <div className="space-y-2">
            <Label>Related Industries</Label>
            <p className="text-xs text-muted">Shown on the matching Industry pages as a related project.</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {industries.map((industry) => (
                <label
                  key={industry.id}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-text"
                >
                  <input
                    type="checkbox"
                    checked={selectedIndustryIds.includes(industry.id)}
                    onChange={(e) => toggleIndustry(industry.id, e.target.checked)}
                    className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary/30"
                  />
                  {industry.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Story</h3>
        <FormField label="Challenge" htmlFor="challenge" error={errors.challenge?.message}>
          <Textarea id="challenge" rows={3} {...register("challenge")} />
        </FormField>
        <FormField label="Research" htmlFor="research" error={errors.research?.message}>
          <Textarea id="research" rows={3} {...register("research")} />
        </FormField>
        <FormField label="Strategy" htmlFor="strategy" error={errors.strategy?.message}>
          <Textarea id="strategy" rows={3} {...register("strategy")} />
        </FormField>
        <FormField label="Concept" htmlFor="concept" error={errors.concept?.message}>
          <Textarea id="concept" rows={3} {...register("concept")} />
        </FormField>
        <FormField label="Design Process" htmlFor="designProcess" error={errors.designProcess?.message}>
          <Textarea id="designProcess" rows={3} {...register("designProcess")} />
        </FormField>
        <FormField label="Photography" htmlFor="photography" error={errors.photography?.message}>
          <Textarea id="photography" rows={3} {...register("photography")} />
        </FormField>
        <FormField label="Printing" htmlFor="printing" error={errors.printing?.message}>
          <Textarea id="printing" rows={3} {...register("printing")} />
        </FormField>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Gallery</h3>
        <div className="space-y-3">
          {galleryArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input {...register(`gallery.${index}.url` as const)} placeholder="https://…" />
                {errors.gallery?.[index]?.url?.message && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{errors.gallery[index]?.url?.message}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => galleryArray.remove(index)}
                className="flex h-[3.25rem] w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => galleryArray.append({ url: "" })}>
          <Plus className="h-4 w-4" /> Add Image
        </Button>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">Deliverables &amp; Testimonial</h3>
        <div className="space-y-2">
          <Label>Deliverables</Label>
          <Controller
            control={control}
            name="deliverables"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Brand Guidelines" />
            )}
          />
        </div>
        <FormField label="Testimonial" htmlFor="testimonialId" error={errors.testimonialId?.message}>
          <Controller
            control={control}
            name="testimonialId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="testimonialId">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {testimonials.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-lg font-medium text-primary">SEO</h3>
        <FormField
          label="SEO Title"
          htmlFor="seoTitle"
          error={errors.seoTitle?.message}
          hint="Falls back to the project title if left blank."
        >
          <Input id="seoTitle" {...register("seoTitle")} placeholder="Aurum Skincare Rebrand — Cee-Shell" />
        </FormField>
        <FormField label="SEO Description" htmlFor="seoDescription" error={errors.seoDescription?.message}>
          <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
        </FormField>
      </section>

      <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-white px-6 py-4">
        <Button type="button" variant="secondary" size="sm" asChild>
          <Link href="/admin/portfolio">Cancel</Link>
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
