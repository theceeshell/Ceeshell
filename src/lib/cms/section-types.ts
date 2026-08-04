import { z } from "zod";

/**
 * Every section on the site is one of these types. Each type's `content`
 * column is validated against the matching schema below. Sections that
 * showcase reusable content (testimonials, services, portfolio, faqs) store
 * only ids/refs in `content` -- the actual records are resolved at render
 * time (see resolve-section.ts) so nothing is ever duplicated between a
 * section and its source entity.
 *
 * To add a new section type: add it to SECTION_TYPES, add its schema below,
 * add a case in resolve-section.ts, add a renderer case in
 * section-renderer.tsx, and add an edit form in
 * src/components/admin/section-forms/.
 */
export const SECTION_TYPES = [
  { type: "hero", label: "Hero", description: "Full-bleed banner with heading, description and buttons." },
  { type: "richText", label: "Rich Text", description: "A heading, editorial copy, and an optional image. Also covers quote-style statements." },
  { type: "imageGallery", label: "Image Gallery", description: "A heading plus a grid of images." },
  { type: "cards", label: "Cards", description: "A heading and any number of cards (used for values, benefits, process steps, etc.)." },
  { type: "stats", label: "Statistics", description: "A row of animated counters." },
  { type: "testimonials", label: "Testimonials", description: "A slider of selected client testimonials." },
  { type: "portfolioShowcase", label: "Portfolio Showcase", description: "A grid of selected (or filterable) portfolio projects." },
  { type: "servicesShowcase", label: "Services Showcase", description: "A grid of selected services." },
  { type: "logoSlider", label: "Logo Slider", description: "An infinite-scrolling strip of client names." },
  { type: "timeline", label: "Timeline", description: "A chronological list of milestones." },
  { type: "faq", label: "FAQ", description: "An accordion of selected FAQs (optionally filtered by category)." },
  { type: "cta", label: "Call To Action", description: "A closing banner with a heading and buttons." },
  { type: "teamShowcase", label: "Team Showcase", description: "A grid of team member cards." },
  { type: "contactBlock", label: "Contact Details + Form", description: "Business info, map and the project inquiry form." },
  { type: "industriesShowcase", label: "Industries Showcase", description: "A grid of selected industries." },
  { type: "blogShowcase", label: "Blog Showcase", description: "Featured article plus a searchable, filterable post grid." },
] as const;

export type SectionType = (typeof SECTION_TYPES)[number]["type"];

const button = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const heroSchema = z.object({
  variant: z.enum(["home", "page"]).default("page"),
  badge: z.string().optional(),
  heading: z.string().min(1),
  description: z.string().optional(),
  backgroundImageUrl: z.string().min(1),
  primaryButton: button.optional(),
  secondaryButton: button.optional(),
});

export const richTextSchema = z.discriminatedUnion("variant", [
  z.object({
    variant: z.literal("default"),
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    content: z.string().min(1),
    imageUrl: z.string().optional(),
    alignment: z.enum(["left", "center", "right"]).default("left"),
  }),
  z.object({
    variant: z.literal("founderQuote"),
    eyebrow: z.string().optional(),
    quote: z.string().min(1),
    authorName: z.string().min(1),
    authorRole: z.string().min(1),
    initials: z.string().min(1).max(3),
  }),
  z.object({
    variant: z.literal("philosophyQuote"),
    eyebrow: z.string().optional(),
    statement: z.string().min(1),
  }),
  z.object({
    variant: z.literal("splitStory"),
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    imageUrl: z.string().min(1),
    imageSide: z.enum(["left", "right"]).default("left"),
  }),
]);

export const cardItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
  buttonHref: z.string().optional(),
});

export const cardsSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  description: z.string().optional(),
  style: z.enum(["default", "iconList", "numbered", "bordered", "achievements", "twoColumn"]).default("default"),
  /** Only used by the "iconList" style, which lays out an image beside the list (e.g. Home's "Why Choose Us"). */
  sideImageUrl: z.string().optional(),
  sideImageSecondaryUrl: z.string().optional(),
  viewAllLink: button.optional(),
  cards: z.array(cardItemSchema).min(1),
});

export const statsSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  counters: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.number(),
        suffix: z.string().optional(),
      })
    )
    .min(1),
});

export const testimonialsSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  testimonialIds: z.array(z.string()).default([]),
});

export const portfolioShowcaseSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  description: z.string().optional(),
  displayStyle: z.enum(["editorialGrid", "filterable"]).default("editorialGrid"),
  projectIds: z.array(z.string()).default([]),
  limit: z.number().optional(),
  viewAllLink: button.optional(),
});

export const servicesShowcaseSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  description: z.string().optional(),
  serviceIds: z.array(z.string()).default([]),
  viewAllLink: button.optional(),
});

export const logoSliderSchema = z.object({
  heading: z.string().optional(),
  logos: z.array(z.string().min(1)).min(1),
});

export const timelineSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  layout: z.enum(["vertical", "alternating"]).default("vertical"),
  items: z
    .array(
      z.object({
        year: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
});

export const faqSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  category: z.string().optional(),
  faqIds: z.array(z.string()).default([]),
  layout: z.enum(["simple", "sidebarCta"]).default("simple"),
});

export const ctaSchema = z.object({
  heading: z.string().min(1),
  description: z.string().optional(),
  primaryButton: button.optional(),
  secondaryButton: button.optional(),
});

export const teamShowcaseSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  memberIds: z.array(z.string()).default([]),
});

export const contactBlockSchema = z.object({
  heading: z.string().min(1),
  description: z.string().optional(),
  showMap: z.boolean().default(true),
  faqIds: z.array(z.string()).default([]),
});

export const industriesShowcaseSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  description: z.string().optional(),
  industryIds: z.array(z.string()).default([]),
});

export const blogShowcaseSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  postIds: z.array(z.string()).default([]),
});

export const SECTION_SCHEMAS = {
  hero: heroSchema,
  richText: richTextSchema,
  imageGallery: z.object({
    heading: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string().min(1)).min(1),
  }),
  cards: cardsSchema,
  stats: statsSchema,
  testimonials: testimonialsSchema,
  portfolioShowcase: portfolioShowcaseSchema,
  servicesShowcase: servicesShowcaseSchema,
  logoSlider: logoSliderSchema,
  timeline: timelineSchema,
  faq: faqSectionSchema,
  cta: ctaSchema,
  teamShowcase: teamShowcaseSchema,
  contactBlock: contactBlockSchema,
  industriesShowcase: industriesShowcaseSchema,
  blogShowcase: blogShowcaseSchema,
} as const satisfies Record<SectionType, z.ZodType>;

export type SectionContent<T extends SectionType> = z.infer<(typeof SECTION_SCHEMAS)[T]>;
