"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  useWatch,
  Controller,
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/ui/form-field";
import { IconPicker } from "@/components/admin/ui/icon-picker";
import { GalleryField, ImageField } from "@/components/admin/media/image-field";
import { serviceFormSchema, type ServiceFormShape } from "@/lib/validators/service";
import { createServiceAction, updateServiceAction } from "@/lib/actions/service-actions";

export interface ServiceRecord {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  summary: string;
  heroImageUrl: string;
  overview: unknown;
  benefits: unknown;
  process: unknown;
  subServices: unknown;
  gallery: unknown;
  faqs: unknown;
  featured: boolean;
  visible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface ServiceFormProps {
  service?: ServiceRecord;
}

type TitleDescriptionRow = { title: string; description: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyValues(): ServiceFormShape {
  return {
    slug: "",
    name: "",
    shortName: "",
    icon: "camera",
    tagline: "",
    summary: "",
    heroImageUrl: "",
    overview: [{ value: "" }],
    benefits: [{ title: "", description: "" }],
    process: [{ title: "", description: "" }],
    subServices: [{ title: "", description: "" }],
    gallery: [],
    faqs: [],
    featured: true,
    visible: true,
    seoTitle: "",
    seoDescription: "",
  };
}

function toFormShape(service: ServiceRecord): ServiceFormShape {
  const overview = ((service.overview as string[] | null) ?? []).filter(Boolean);
  const gallery = ((service.gallery as string[] | null) ?? []).filter(Boolean);
  const benefits = (service.benefits as TitleDescriptionRow[] | null) ?? [];
  const process = (service.process as TitleDescriptionRow[] | null) ?? [];
  const subServices = (service.subServices as TitleDescriptionRow[] | null) ?? [];
  const faqs = (service.faqs as { question: string; answer: string }[] | null) ?? [];

  return {
    slug: service.slug,
    name: service.name,
    shortName: service.shortName,
    icon: service.icon,
    tagline: service.tagline,
    summary: service.summary,
    heroImageUrl: service.heroImageUrl,
    overview: overview.length ? overview.map((value) => ({ value })) : [{ value: "" }],
    benefits: benefits.length ? benefits : [{ title: "", description: "" }],
    process: process.length ? process : [{ title: "", description: "" }],
    subServices: subServices.length ? subServices : [{ title: "", description: "" }],
    gallery,
    faqs,
    featured: service.featured,
    visible: service.visible,
    seoTitle: service.seoTitle ?? "",
    seoDescription: service.seoDescription ?? "",
  };
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(service);
  const [slugTouched, setSlugTouched] = React.useState(isEditing);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormShape>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service ? toFormShape(service) : emptyValues(),
  });

  const overviewArray = useFieldArray({ control, name: "overview" });
  const faqsArray = useFieldArray({ control, name: "faqs" });

  const nameValue = useWatch({ control, name: "name" });

  React.useEffect(() => {
    if (!isEditing && !slugTouched) {
      setValue("slug", slugify(nameValue || ""), { shouldValidate: false });
    }
  }, [nameValue, slugTouched, isEditing, setValue]);

  async function onSubmit(values: ServiceFormShape) {
    const payload = {
      ...values,
      overview: values.overview.map((row) => row.value),
      seoTitle: values.seoTitle?.trim() ? values.seoTitle.trim() : null,
      seoDescription: values.seoDescription?.trim() ? values.seoDescription.trim() : null,
    };

    try {
      const result = isEditing && service
        ? await updateServiceAction(service.id, payload)
        : await createServiceAction(payload);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isEditing ? "Service updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6">
      {/* Basics */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <h3 className="font-heading text-lg font-medium text-primary mb-1">Basics</h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} placeholder="Brand Identity Design" />
          </FormField>
          <FormField
            label="Short Name"
            htmlFor="shortName"
            error={errors.shortName?.message}
            hint="Used in compact spaces like nav menus."
          >
            <Input id="shortName" {...register("shortName")} placeholder="Branding" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Used in the URL, e.g. /services/brand-identity"
          >
            <Input
              id="slug"
              {...register("slug", { onChange: () => setSlugTouched(true) })}
              placeholder="brand-identity"
            />
          </FormField>
          <FormField label="Icon" htmlFor="icon" error={errors.icon?.message}>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => <IconPicker id="icon" value={field.value} onChange={field.onChange} />}
            />
          </FormField>
        </div>

        <FormField label="Tagline" htmlFor="tagline" error={errors.tagline?.message}>
          <Input id="tagline" {...register("tagline")} placeholder="A short, punchy tagline" />
        </FormField>

        <FormField label="Summary" htmlFor="summary" error={errors.summary?.message}>
          <Textarea
            id="summary"
            rows={3}
            {...register("summary")}
            placeholder="One or two sentence summary shown on cards."
          />
        </FormField>

        <Controller
          control={control}
          name="heroImageUrl"
          render={({ field }) => (
            <ImageField
              label="Main photo or video"
              value={field.value}
              onChange={field.onChange}
              error={errors.heroImageUrl?.message}
              hint="The large background at the top of the service page."
              allowVideo
            />
          )}
        />

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <div>
            <Label htmlFor="featured">Featured</Label>
            <p className="mt-0.5 text-xs text-muted">
              Featured services are highlighted on the homepage and services page.
            </p>
          </div>
          <Controller
            control={control}
            name="featured"
            render={({ field }) => <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <div>
            <Label htmlFor="visible">Show on website</Label>
            <p className="mt-0.5 text-xs text-muted">Turn off to hide it from the website without deleting it.</p>
          </div>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => <Switch id="visible" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-1">Overview</h3>
          <p className="text-sm text-muted">Paragraphs shown in the service&apos;s overview section.</p>
        </div>
        <div className="space-y-4">
          {overviewArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <Textarea
                  rows={3}
                  {...register(`overview.${index}.value`)}
                  placeholder="Write an overview paragraph…"
                />
                {errors.overview?.[index]?.value?.message && (
                  <p className="text-xs font-medium text-red-600">{errors.overview[index]?.value?.message}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Remove paragraph"
                onClick={() => overviewArray.remove(index)}
                disabled={overviewArray.fields.length === 1}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {typeof errors.overview?.message === "string" && (
          <p className="text-xs font-medium text-red-600">{errors.overview.message}</p>
        )}
        <Button type="button" variant="secondary" size="sm" onClick={() => overviewArray.append({ value: "" })}>
          <Plus className="h-4 w-4" /> Add Paragraph
        </Button>
      </div>

      <TitleDescriptionSection
        control={control}
        register={register}
        errors={errors}
        name="benefits"
        heading="Benefits"
        description="Reasons clients should choose this service."
        addLabel="Add Benefit"
        titlePlaceholder="Consistent brand experience"
        descriptionPlaceholder="Describe the benefit…"
      />

      <TitleDescriptionSection
        control={control}
        register={register}
        errors={errors}
        name="process"
        heading="Process Steps"
        description="The steps clients go through when working with this service."
        addLabel="Add Step"
        titlePlaceholder="Discovery"
        descriptionPlaceholder="Describe this step…"
      />

      <TitleDescriptionSection
        control={control}
        register={register}
        errors={errors}
        name="subServices"
        heading="Sub-Services"
        description="Specific capabilities included under this service."
        addLabel="Add Capability"
        titlePlaceholder="Logo Design"
        descriptionPlaceholder="Describe this capability…"
      />

      {/* Gallery */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-1">Gallery</h3>
          <p className="text-sm text-muted">Images shown in the service&apos;s gallery.</p>
        </div>
        <Controller
          control={control}
          name="gallery"
          render={({ field }) => (
            <GalleryField
              label="Photos & videos"
              values={field.value}
              onChange={field.onChange}
              error={errors.gallery?.message}
              hint="Shown in this order. Use the arrows to rearrange. Videos get a play button."
              allowVideo
            />
          )}
        />
      </div>

      {/* FAQs */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-1">FAQs</h3>
          <p className="text-sm text-muted">Optional questions shown on this service&apos;s page.</p>
        </div>
        <div className="space-y-4">
          {faqsArray.fields.map((field, index) => (
            <div key={field.id} className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <FormField
                    label="Question"
                    htmlFor={`faqs.${index}.question`}
                    error={errors.faqs?.[index]?.question?.message}
                  >
                    <Input
                      id={`faqs.${index}.question`}
                      {...register(`faqs.${index}.question`)}
                      placeholder="What's the typical turnaround?"
                    />
                  </FormField>
                  <FormField
                    label="Answer"
                    htmlFor={`faqs.${index}.answer`}
                    error={errors.faqs?.[index]?.answer?.message}
                  >
                    <Textarea
                      id={`faqs.${index}.answer`}
                      rows={2}
                      {...register(`faqs.${index}.answer`)}
                      placeholder="Write a clear answer…"
                    />
                  </FormField>
                </div>
                <button
                  type="button"
                  aria-label="Remove question"
                  onClick={() => faqsArray.remove(index)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {faqsArray.fields.length === 0 && <p className="text-sm text-muted">No FAQs added yet.</p>}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => faqsArray.append({ question: "", answer: "" })}
        >
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>

      {/* SEO */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <h3 className="font-heading text-lg font-medium text-primary mb-1">SEO</h3>
        <FormField
          label="SEO Title"
          htmlFor="seoTitle"
          error={errors.seoTitle?.message}
          hint="Optional — overrides the page title used for search engines."
        >
          <Input id="seoTitle" {...register("seoTitle")} placeholder="Leave blank to use the service name" />
        </FormField>
        <FormField
          label="SEO Description"
          htmlFor="seoDescription"
          error={errors.seoDescription?.message}
          hint="Optional — overrides the meta description."
        >
          <Textarea
            id="seoDescription"
            rows={3}
            {...register("seoDescription")}
            placeholder="Leave blank to use the summary"
          />
        </FormField>
      </div>

      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 rounded-2xl border border-border bg-white/95 px-6 py-4 backdrop-blur">
        <Link href="/admin/services" className="text-sm font-medium text-muted hover:text-primary">
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}

interface TitleDescriptionSectionProps {
  control: Control<ServiceFormShape>;
  register: UseFormRegister<ServiceFormShape>;
  errors: FieldErrors<ServiceFormShape>;
  name: "benefits" | "process" | "subServices";
  heading: string;
  description: string;
  addLabel: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
}

function TitleDescriptionSection({
  control,
  register,
  errors,
  name,
  heading,
  description,
  addLabel,
  titlePlaceholder,
  descriptionPlaceholder,
}: TitleDescriptionSectionProps) {
  const fieldArray = useFieldArray({ control, name });
  const listError = errors[name]?.message;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
      <div>
        <h3 className="font-heading text-lg font-medium text-primary mb-1">{heading}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <div className="space-y-4">
        {fieldArray.fields.map((field, index) => {
          const rowError = errors[name]?.[index];
          return (
            <div key={field.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <FormField
                    label="Title"
                    htmlFor={`${name}.${index}.title`}
                    error={rowError?.title?.message}
                  >
                    <Input
                      id={`${name}.${index}.title`}
                      {...register(`${name}.${index}.title` as const)}
                      placeholder={titlePlaceholder}
                    />
                  </FormField>
                  <FormField
                    label="Description"
                    htmlFor={`${name}.${index}.description`}
                    error={rowError?.description?.message}
                  >
                    <Textarea
                      id={`${name}.${index}.description`}
                      rows={2}
                      {...register(`${name}.${index}.description` as const)}
                      placeholder={descriptionPlaceholder}
                    />
                  </FormField>
                </div>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => fieldArray.remove(index)}
                  disabled={fieldArray.fields.length === 1}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {typeof listError === "string" && <p className="text-xs font-medium text-red-600">{listError}</p>}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => fieldArray.append({ title: "", description: "" })}
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
