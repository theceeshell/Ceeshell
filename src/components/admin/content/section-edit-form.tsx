"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  TextField,
  TextAreaField,
  SwitchField,
  SelectField,
  OptionalButtonField,
  StringArrayField,
  ObjectArrayField,
  ReferencePickerField,
} from "@/components/admin/content/field-editors";
import type { SectionType } from "@/lib/cms/section-types";
import type { ReferenceOptions } from "@/lib/cms/reference-options";

// Editor state for 16 different section shapes; validated against SECTION_SCHEMAS on submit.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Content = Record<string, any>;

function defaultsFor(type: SectionType): Content {
  switch (type) {
    case "hero":
      return { variant: "page", badge: "", heading: "", description: "", backgroundImageUrl: "" };
    case "richText":
      return { variant: "default", eyebrow: "", heading: "", content: "", alignment: "left" };
    case "imageGallery":
      return { heading: "", description: "", images: [] };
    case "cards":
      return { eyebrow: "", heading: "", description: "", style: "default", cards: [] };
    case "stats":
      return { eyebrow: "", heading: "", counters: [] };
    case "testimonials":
      return { eyebrow: "", heading: "", testimonialIds: [] };
    case "portfolioShowcase":
      return { eyebrow: "", heading: "", description: "", displayStyle: "editorialGrid", projectIds: [] };
    case "servicesShowcase":
      return { eyebrow: "", heading: "", description: "", serviceIds: [] };
    case "logoSlider":
      return { heading: "", logos: [] };
    case "timeline":
      return { eyebrow: "", heading: "", layout: "vertical", items: [] };
    case "faq":
      return { eyebrow: "", heading: "", faqIds: [], layout: "simple" };
    case "cta":
      return { heading: "", description: "" };
    case "teamShowcase":
      return { eyebrow: "", heading: "", memberIds: [] };
    case "contactBlock":
      return { heading: "", description: "", showMap: true, faqIds: [] };
    case "industriesShowcase":
      return { eyebrow: "", heading: "", description: "", industryIds: [] };
    case "blogShowcase":
      return { heading: "", postIds: [] };
    default:
      return {};
  }
}

interface SectionEditFormProps {
  type: SectionType;
  initialContent?: Content;
  referenceOptions: ReferenceOptions;
  onSubmit: (content: Content) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function SectionEditForm({ type, initialContent, referenceOptions, onSubmit, onCancel, submitLabel }: SectionEditFormProps) {
  const [content, setContent] = React.useState<Content>(() => ({ ...defaultsFor(type), ...initialContent }));
  const [errors, setErrors] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);

  function set(patch: Partial<Content>) {
    setContent((prev) => ({ ...prev, ...patch }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setPending(true);
    try {
      await onSubmit(content);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.issues.map((i) => `${i.path.join(".") || "Field"}: ${i.message}`));
      } else {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {renderFields(type, content, set, referenceOptions)}

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <ul className="list-inside list-disc space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="sm" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

function renderFields(type: SectionType, content: Content, set: (patch: Partial<Content>) => void, refs: ReferenceOptions) {
  switch (type) {
    case "hero":
      return (
        <>
          <SelectField
            label="Variant"
            value={content.variant}
            onChange={(v) => set({ variant: v })}
            options={[
              { value: "page", label: "Inner page (with breadcrumb)" },
              { value: "home", label: "Home (full-screen, no breadcrumb)" },
            ]}
          />
          <TextField label="Badge / Eyebrow" value={content.badge ?? ""} onChange={(v) => set({ badge: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <TextField
            label="Background Image URL"
            value={content.backgroundImageUrl}
            onChange={(v) => set({ backgroundImageUrl: v })}
            hint="Paste a URL, or upload the image in Media Library and paste its URL here."
          />
          <OptionalButtonField label="Primary Button" value={content.primaryButton} onChange={(v) => set({ primaryButton: v })} />
          <OptionalButtonField label="Secondary Button" value={content.secondaryButton} onChange={(v) => set({ secondaryButton: v })} />
        </>
      );

    case "richText":
      return (
        <>
          <SelectField
            label="Style"
            value={content.variant}
            onChange={(v) => set({ variant: v })}
            options={[
              { value: "default", label: "Editorial paragraph" },
              { value: "splitStory", label: "Split story (image + paragraphs)" },
              { value: "founderQuote", label: "Founder quote" },
              { value: "philosophyQuote", label: "Centered statement" },
            ]}
          />
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />

          {content.variant === "philosophyQuote" && (
            <TextAreaField label="Statement" value={content.statement ?? ""} onChange={(v) => set({ statement: v })} />
          )}

          {content.variant === "founderQuote" && (
            <>
              <TextAreaField label="Quote" value={content.quote ?? ""} onChange={(v) => set({ quote: v })} />
              <TextField label="Author Name" value={content.authorName ?? ""} onChange={(v) => set({ authorName: v })} />
              <TextField label="Author Role" value={content.authorRole ?? ""} onChange={(v) => set({ authorRole: v })} />
              <TextField label="Initials" value={content.initials ?? ""} onChange={(v) => set({ initials: v.slice(0, 3) })} />
            </>
          )}

          {content.variant === "splitStory" && (
            <>
              <TextField label="Heading" value={content.heading ?? ""} onChange={(v) => set({ heading: v })} />
              <StringArrayField
                label="Paragraphs"
                values={content.paragraphs ?? []}
                onChange={(v) => set({ paragraphs: v })}
                addLabel="Add Paragraph"
              />
              <TextField label="Image URL" value={content.imageUrl ?? ""} onChange={(v) => set({ imageUrl: v })} />
              <SelectField
                label="Image Side"
                value={content.imageSide ?? "left"}
                onChange={(v) => set({ imageSide: v })}
                options={[{ value: "left", label: "Left" }, { value: "right", label: "Right" }]}
              />
            </>
          )}

          {content.variant === "default" && (
            <>
              <TextField label="Heading" value={content.heading ?? ""} onChange={(v) => set({ heading: v })} />
              <TextAreaField label="Content" value={content.content ?? ""} onChange={(v) => set({ content: v })} rows={6} />
              <TextField label="Image URL (optional)" value={content.imageUrl ?? ""} onChange={(v) => set({ imageUrl: v })} />
              <SelectField
                label="Alignment"
                value={content.alignment ?? "left"}
                onChange={(v) => set({ alignment: v })}
                options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]}
              />
            </>
          )}
        </>
      );

    case "imageGallery":
      return (
        <>
          <TextField label="Heading (optional)" value={content.heading ?? ""} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description (optional)" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <StringArrayField label="Images" values={content.images ?? []} onChange={(v) => set({ images: v })} placeholder="Image URL" addLabel="Add Image" />
        </>
      );

    case "cards":
      return (
        <>
          <SelectField
            label="Style"
            value={content.style}
            onChange={(v) => set({ style: v })}
            options={[
              { value: "default", label: "Default (icon, image, button per card)" },
              { value: "iconList", label: "Checklist with side image (Home 'Why Choose Us')" },
              { value: "numbered", label: "Numbered grid (process preview)" },
              { value: "bordered", label: "Bordered list (values)" },
              { value: "achievements", label: "Achievements strip" },
              { value: "twoColumn", label: "Two-column statements (mission & vision)" },
            ]}
          />
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          {content.style === "iconList" && (
            <>
              <TextField label="Side Image URL" value={content.sideImageUrl ?? ""} onChange={(v) => set({ sideImageUrl: v })} />
              <TextField label="Secondary Side Image URL (optional)" value={content.sideImageSecondaryUrl ?? ""} onChange={(v) => set({ sideImageSecondaryUrl: v })} />
            </>
          )}
          {content.style === "numbered" && (
            <OptionalButtonField label="'View All' Link" value={content.viewAllLink} onChange={(v) => set({ viewAllLink: v })} />
          )}
          <ObjectArrayField
            label="Cards"
            values={content.cards ?? []}
            onChange={(v) => set({ cards: v })}
            emptyItem={{ title: "", description: "", icon: "", imageUrl: "", buttonLabel: "", buttonHref: "" }}
            addLabel="Add Card"
            renderItem={(item, update) => (
              <>
                <Input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" />
                <Textarea rows={2} value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Description" />
                {content.style === "default" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={item.icon ?? ""} onChange={(e) => update({ icon: e.target.value })} placeholder="Icon (camera/layers/package/printer/gift)" />
                    <Input value={item.imageUrl ?? ""} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="Image URL" />
                    <Input value={item.buttonLabel ?? ""} onChange={(e) => update({ buttonLabel: e.target.value })} placeholder="Button label" />
                    <Input value={item.buttonHref ?? ""} onChange={(e) => update({ buttonHref: e.target.value })} placeholder="Button link" />
                  </div>
                )}
              </>
            )}
          />
        </>
      );

    case "stats":
      return (
        <>
          <TextField label="Eyebrow (optional)" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading (optional)" value={content.heading ?? ""} onChange={(v) => set({ heading: v })} />
          <ObjectArrayField
            label="Counters"
            values={content.counters ?? []}
            onChange={(v) => set({ counters: v })}
            emptyItem={{ label: "", value: "0", suffix: "" }}
            addLabel="Add Counter"
            renderItem={(item, update) => (
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => update({ value: e.target.value })}
                  placeholder="Value"
                />
                <Input value={item.suffix ?? ""} onChange={(e) => update({ suffix: e.target.value })} placeholder="Suffix (e.g. +)" />
                <Input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Label" className="col-span-1" />
              </div>
            )}
          />
        </>
      );

    case "testimonials":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <ReferencePickerField label="Testimonials" options={refs.testimonials} selectedIds={content.testimonialIds ?? []} onChange={(v) => set({ testimonialIds: v })} />
        </>
      );

    case "portfolioShowcase":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <SelectField
            label="Display Style"
            value={content.displayStyle}
            onChange={(v) => set({ displayStyle: v })}
            options={[
              { value: "editorialGrid", label: "Curated editorial grid" },
              { value: "filterable", label: "Full filterable grid (shows all projects)" },
            ]}
          />
          {content.displayStyle === "editorialGrid" && (
            <ReferencePickerField label="Projects to feature" options={refs.projects} selectedIds={content.projectIds ?? []} onChange={(v) => set({ projectIds: v })} />
          )}
          <OptionalButtonField label="'View All' Link" value={content.viewAllLink} onChange={(v) => set({ viewAllLink: v })} />
        </>
      );

    case "servicesShowcase":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <ReferencePickerField label="Services" hint="Leave empty to show all featured services." options={refs.services} selectedIds={content.serviceIds ?? []} onChange={(v) => set({ serviceIds: v })} />
          <OptionalButtonField label="'View All' Link" value={content.viewAllLink} onChange={(v) => set({ viewAllLink: v })} />
        </>
      );

    case "logoSlider":
      return (
        <>
          <TextField label="Heading (optional)" value={content.heading ?? ""} onChange={(v) => set({ heading: v })} />
          <StringArrayField label="Client Names" values={content.logos ?? []} onChange={(v) => set({ logos: v })} placeholder="Client or brand name" addLabel="Add Client" />
        </>
      );

    case "timeline":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <SelectField
            label="Layout"
            value={content.layout}
            onChange={(v) => set({ layout: v })}
            options={[
              { value: "vertical", label: "Vertical list (About-style)" },
              { value: "alternating", label: "Alternating large timeline (Process-style)" },
            ]}
          />
          <ObjectArrayField
            label="Milestones"
            values={content.items ?? []}
            onChange={(v) => set({ items: v })}
            emptyItem={{ year: "", title: "", description: "" }}
            addLabel="Add Milestone"
            renderItem={(item, update) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={item.year} onChange={(e) => update({ year: e.target.value })} placeholder="Year / step number" />
                  <Input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" />
                </div>
                <Textarea rows={2} value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Description" />
              </>
            )}
          />
        </>
      );

    case "faq":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <SelectField
            label="Layout"
            value={content.layout}
            onChange={(v) => set({ layout: v })}
            options={[
              { value: "simple", label: "Simple centered accordion" },
              { value: "sidebarCta", label: "Accordion with sticky 'Start a Project' sidebar" },
            ]}
          />
          <TextField label="Filter by Category (optional)" value={content.category ?? ""} onChange={(v) => set({ category: v })} hint="Leave blank with no FAQs selected below to show every FAQ." />
          <ReferencePickerField label="Specific FAQs (optional)" options={refs.faqs} selectedIds={content.faqIds ?? []} onChange={(v) => set({ faqIds: v })} />
        </>
      );

    case "cta":
      return (
        <>
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <OptionalButtonField label="Primary Button" value={content.primaryButton} onChange={(v) => set({ primaryButton: v })} />
          <OptionalButtonField label="Secondary Button" value={content.secondaryButton} onChange={(v) => set({ secondaryButton: v })} />
        </>
      );

    case "teamShowcase":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <ReferencePickerField label="Team Members" hint="Leave empty to show every active team member." options={refs.members} selectedIds={content.memberIds ?? []} onChange={(v) => set({ memberIds: v })} />
        </>
      );

    case "contactBlock":
      return (
        <>
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <SwitchField label="Show Map" checked={content.showMap} onChange={(v) => set({ showMap: v })} />
          <ReferencePickerField label="FAQs shown below the form" hint="Leave empty to show the first 5 FAQs." options={refs.faqs} selectedIds={content.faqIds ?? []} onChange={(v) => set({ faqIds: v })} />
        </>
      );

    case "industriesShowcase":
      return (
        <>
          <TextField label="Eyebrow" value={content.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Description" value={content.description ?? ""} onChange={(v) => set({ description: v })} />
          <ReferencePickerField label="Industries" hint="Leave empty to show every industry." options={refs.industries} selectedIds={content.industryIds ?? []} onChange={(v) => set({ industryIds: v })} />
        </>
      );

    case "blogShowcase":
      return (
        <>
          <TextField label="Heading" value={content.heading} onChange={(v) => set({ heading: v })} />
          <ReferencePickerField label="Posts" hint="Leave empty to show every published post, most recent first." options={refs.posts} selectedIds={content.postIds ?? []} onChange={(v) => set({ postIds: v })} />
        </>
      );

    default:
      return null;
  }
}
