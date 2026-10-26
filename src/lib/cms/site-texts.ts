/**
 * Every fixed label, heading and option list on the public site that isn't
 * part of a page section or a content item (service, project, post...).
 *
 * The definitions below drive both the Admin -> Website Texts form (labels,
 * help, field types) and the typed `SiteTexts` object components read. The
 * `default` is used until an editor changes it, so adding a field here never
 * requires a migration. Overrides are stored in SiteSettings.texts.
 *
 * Use {placeholders} for values filled in at render time; the admin shows
 * which placeholders each text supports.
 */

type FieldType = "text" | "textarea" | "link" | "list";

interface TextFieldDef {
  key: string;
  label: string;
  default: string | readonly string[];
  type?: FieldType;
  help?: string;
}

interface TextGroupDef {
  key: string;
  label: string;
  description: string;
  fields: readonly TextFieldDef[];
}

export const SITE_TEXT_GROUPS = [
  {
    key: "header",
    label: "Header & menu",
    description: "The button in the top menu bar.",
    fields: [
      { key: "ctaLabel", label: "Menu button text", default: "Start Project" },
      { key: "ctaHref", label: "Menu button link", default: "/contact", type: "link" },
      { key: "mobileCtaLabel", label: "Mobile menu button text", default: "Start Your Project" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    description: "Column titles and the newsletter box at the bottom of every page.",
    fields: [
      { key: "linksColumnTitle", label: "Links column title", default: "Studio" },
      { key: "servicesColumnTitle", label: "Services column title", default: "Services" },
      { key: "newsletterHeading", label: "Newsletter heading", default: "Stay in the loop" },
      {
        key: "newsletterText",
        label: "Newsletter text",
        type: "textarea",
        default: "Occasional notes on branding, packaging and photography. No spam, unsubscribe any time.",
      },
      { key: "privacyLabel", label: "Privacy link text", default: "Privacy Policy" },
      { key: "termsLabel", label: "Terms link text", default: "Terms of Service" },
    ],
  },
  {
    key: "cta",
    label: "Closing banner",
    description: "The dark \"let's work together\" banner at the end of project pages.",
    fields: [
      { key: "heading", label: "Heading", default: "Let's Build Something Extraordinary" },
      {
        key: "text",
        label: "Text",
        type: "textarea",
        default: "Tell us about your brand, your product and your ambitions — we'll tell you exactly how we'd approach it.",
      },
      { key: "primaryLabel", label: "Main button text", default: "Start Your Project" },
      { key: "primaryHref", label: "Main button link", default: "/contact", type: "link" },
      { key: "secondaryLabel", label: "Second button text", default: "View Portfolio" },
      { key: "secondaryHref", label: "Second button link", default: "/portfolio", type: "link" },
    ],
  },
  {
    key: "newsletter",
    label: "Newsletter sign-up",
    description: "The email sign-up boxes on the blog and in the footer.",
    fields: [
      { key: "placeholder", label: "Email box placeholder", default: "Your email" },
      { key: "button", label: "Button text", default: "Subscribe" },
      { key: "success", label: "Message after signing up", default: "You're subscribed. Welcome aboard." },
      { key: "blogHeading", label: "Blog page heading", default: "Stay in the loop" },
      {
        key: "blogText",
        label: "Blog page text",
        type: "textarea",
        default: "Occasional notes on branding, packaging and photography. No spam, unsubscribe any time.",
      },
      { key: "articleHeading", label: "Below each article: heading", default: "Enjoyed this article?" },
      {
        key: "articleText",
        label: "Below each article: text",
        type: "textarea",
        default: "Subscribe for occasional notes on branding, packaging and photography.",
      },
    ],
  },
  {
    key: "contactForm",
    label: "Contact form",
    description: "Labels, choices and messages of the project inquiry form.",
    fields: [
      { key: "nameLabel", label: "Name label", default: "Full Name" },
      { key: "namePlaceholder", label: "Name placeholder", default: "Jane Cooper" },
      { key: "companyLabel", label: "Company label", default: "Company" },
      { key: "companyPlaceholder", label: "Company placeholder", default: "Your company name" },
      { key: "emailLabel", label: "Email label", default: "Email" },
      { key: "emailPlaceholder", label: "Email placeholder", default: "jane@company.com" },
      { key: "phoneLabel", label: "Phone label", default: "Phone" },
      { key: "phonePlaceholder", label: "Phone placeholder", default: "+92 3__ _______" },
      { key: "industryLabel", label: "Industry label", default: "Industry" },
      { key: "industryPlaceholder", label: "Industry prompt", default: "Select your industry" },
      { key: "industryOther", label: "\"Other\" industry choice", default: "Other" },
      { key: "serviceLabel", label: "Service label", default: "Required Service" },
      { key: "servicePlaceholder", label: "Service prompt", default: "Select a service" },
      { key: "serviceNotSure", label: "\"Not sure\" service choice", default: "Not sure yet" },
      { key: "budgetLabel", label: "Budget label", default: "Budget Range" },
      { key: "budgetPlaceholder", label: "Budget prompt", default: "Select a budget range" },
      {
        key: "budgets",
        label: "Budget choices",
        type: "list",
        default: [
          "Under PKR 150,000",
          "PKR 150,000 – 500,000",
          "PKR 500,000 – 1,500,000",
          "PKR 1,500,000 – 4,000,000",
          "PKR 4,000,000+",
        ],
      },
      { key: "timelineLabel", label: "Timeline label", default: "Timeline" },
      { key: "timelinePlaceholder", label: "Timeline prompt", default: "Select your timeline" },
      {
        key: "timelines",
        label: "Timeline choices",
        type: "list",
        default: ["As soon as possible", "Within 1 month", "1 – 3 months", "3 – 6 months", "Flexible / exploring"],
      },
      { key: "messageLabel", label: "Message label", default: "Project Description" },
      {
        key: "messagePlaceholder",
        label: "Message placeholder",
        default: "Tell us about your brand, your goals and what you're looking to achieve.",
      },
      { key: "fileLabel", label: "Attachment label", default: "Reference Files (optional)" },
      {
        key: "fileHint",
        label: "Attachment box text",
        default: "Attach a brief, brand deck or reference image (PDF, DOCX, PPTX, JPG, PNG · max 4 MB)",
      },
      { key: "submit", label: "Send button text", default: "Submit Inquiry" },
      { key: "successHeading", label: "Thank-you heading", default: "Thank you — your inquiry is in." },
      {
        key: "successText",
        label: "Thank-you text",
        type: "textarea",
        default: "We review every submission personally and typically respond within 2 business days with next steps.",
      },
      {
        key: "fileTooLarge",
        label: "Message when the attachment is too big",
        default: "That file is larger than 4 MB. Please attach a smaller file or send it by email.",
      },
    ],
  },
  {
    key: "contactInfo",
    label: "Contact details box",
    description: "The business information and quick-answers block on the Contact page.",
    fields: [
      { key: "heading", label: "Heading", default: "Business Information" },
      { key: "emailLabel", label: "Email label", default: "Email" },
      { key: "phoneLabel", label: "Phone label", default: "Phone" },
      { key: "addressLabel", label: "Address label", default: "Studio" },
      { key: "hoursLabel", label: "Hours label", default: "Hours" },
      { key: "faqEyebrow", label: "Quick answers small title", default: "Quick Answers" },
      { key: "faqHeading", label: "Quick answers heading", default: "Before you reach out" },
      { key: "faqMoreText", label: "Text before FAQ link", default: "Have a different question?" },
      { key: "faqMoreLink", label: "FAQ link text", default: "View the full FAQ" },
    ],
  },
  {
    key: "faq",
    label: "FAQ side box",
    description: "The \"still have questions\" box next to FAQ lists.",
    fields: [
      { key: "sidebarHeading", label: "Heading", default: "Still have questions?" },
      {
        key: "sidebarText",
        label: "Text",
        type: "textarea",
        default: "Every project is different — the fastest way to get a real answer is to tell us about yours.",
      },
      { key: "sidebarButton", label: "Button text", default: "Start Your Project" },
      { key: "sidebarHref", label: "Button link", default: "/contact", type: "link" },
    ],
  },
  {
    key: "servicePage",
    label: "Service pages",
    description: "Headings on each individual service page. {service} is replaced with the service name.",
    fields: [
      { key: "eyebrow", label: "Small title above the name", default: "Service" },
      { key: "overviewHeading", label: "Overview heading", default: "Overview" },
      { key: "capabilitiesEyebrow", label: "Capabilities small title", default: "Capabilities" },
      { key: "capabilitiesHeading", label: "Capabilities heading", default: "What's included in {service}" },
      { key: "processEyebrow", label: "Process small title", default: "Our Process" },
      { key: "processHeading", label: "Process heading", default: "How a project comes together" },
      { key: "workEyebrow", label: "Gallery small title", default: "Recent Work" },
      { key: "workHeading", label: "Gallery heading", default: "A closer look at the standard" },
      { key: "faqEyebrow", label: "FAQ small title", default: "FAQ" },
      { key: "faqHeading", label: "FAQ heading", default: "Common questions" },
      { key: "moreEyebrow", label: "Other services small title", default: "Explore More" },
      { key: "moreHeading", label: "Other services heading", default: "Other services" },
      { key: "ctaHeading", label: "Closing banner heading", default: "Ready to start your {service} project?" },
      {
        key: "ctaText",
        label: "Closing banner text",
        type: "textarea",
        default: "Tell us about your brand and timeline — we'll follow up with a tailored proposal within 3 business days.",
      },
      { key: "cardLink", label: "\"Explore\" link on service cards", default: "Explore service" },
      {
        key: "galleryAlt",
        label: "Gallery picture description (for screen readers and search engines)",
        default: "{service} project example {number}",
        help: "{number} is the picture's position in the gallery.",
      },
    ],
  },
  {
    key: "projectPage",
    label: "Portfolio pages",
    description: "Labels on each case study and on the portfolio filter. {project} is replaced with the project title.",
    fields: [
      {
        key: "seoTitle",
        label: "Browser tab / Google title",
        default: "{project} — Case Study",
        help: "Used when a project has no SEO title of its own.",
      },
      { key: "clientLabel", label: "Client label", default: "Client" },
      { key: "industryLabel", label: "Industry label", default: "Industry" },
      { key: "yearLabel", label: "Year label", default: "Year" },
      { key: "servicesLabel", label: "Services label", default: "Services" },
      { key: "challengeLabel", label: "\"Challenge\" title", default: "Challenge" },
      { key: "researchLabel", label: "\"Research\" title", default: "Research" },
      { key: "strategyLabel", label: "\"Strategy\" title", default: "Strategy" },
      { key: "conceptLabel", label: "\"Concept\" title", default: "Concept" },
      { key: "designProcessLabel", label: "\"Design Process\" title", default: "Design Process" },
      { key: "photographyLabel", label: "\"Photography\" title", default: "Photography" },
      { key: "printingLabel", label: "\"Printing\" title", default: "Printing" },
      { key: "deliverablesHeading", label: "Deliverables heading", default: "Final Deliverables" },
      { key: "relatedHeading", label: "Related projects heading", default: "Related Projects" },
      { key: "allWorkLink", label: "\"All work\" link", default: "All Work" },
      { key: "nextLabel", label: "\"Next project\" label", default: "Next Project" },
      { key: "viewCaseStudy", label: "\"View case study\" text", default: "View Case Study" },
      { key: "filterAll", label: "Filter: \"All\" button", default: "All" },
      { key: "filterEmpty", label: "Filter: nothing found", default: "No projects in this category yet — check back soon." },
      {
        key: "categories",
        label: "Project categories",
        type: "list",
        help: "The categories you can tick on a project, also used as filter buttons.",
        default: ["Packaging", "Photography", "Brand Identity", "Printing", "Corporate", "Food", "Beauty", "Fashion", "Luxury"],
      },
      {
        key: "galleryAlt",
        label: "Gallery picture description (for screen readers and search engines)",
        default: "{project} gallery image {number}",
        help: "{number} is the picture's position in the gallery.",
      },
    ],
  },
  {
    key: "industryPage",
    label: "Industry pages",
    description: "Headings on each industry page. {industry} is replaced with the industry name.",
    fields: [
      { key: "eyebrow", label: "Small title above the name", default: "Industry" },
      { key: "painPointsHeading", label: "Challenges heading", default: "Pain Points We See" },
      { key: "solutionsHeading", label: "Solutions heading", default: "How We Solve It" },
      { key: "workEyebrow", label: "Projects small title", default: "Relevant Work" },
      { key: "workHeading", label: "Projects heading", default: "{industry} projects" },
      { key: "ctaHeading", label: "Closing banner heading", default: "Building a brand in {industry}?" },
      {
        key: "ctaText",
        label: "Closing banner text",
        type: "textarea",
        default: "Let's talk about your category, your competitors and where the opportunity actually is.",
      },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    description: "Labels on the blog list and on each article. {author} and {minutes} are filled in automatically.",
    fields: [
      { key: "featuredLabel", label: "\"Featured\" label", default: "Featured Article" },
      { key: "readArticle", label: "\"Read\" link", default: "Read Article" },
      { key: "latestEyebrow", label: "Post list small title", default: "Latest Posts" },
      { key: "filterAll", label: "Filter: \"All\" button", default: "All" },
      { key: "searchPlaceholder", label: "Search box placeholder", default: "Search articles" },
      { key: "searchEmpty", label: "Search: nothing found", default: "No articles match your search — try a different term or category." },
      { key: "byAuthor", label: "Author line", default: "By {author}" },
      { key: "readTime", label: "Reading time", default: "{minutes} min read" },
      { key: "relatedHeading", label: "Related articles heading", default: "Related Articles" },
      {
        key: "categories",
        label: "Blog categories",
        type: "list",
        help: "The categories you can choose for a blog post.",
        default: ["Branding", "Packaging", "Photography", "Print Production", "Design Trends", "Business"],
      },
    ],
  },
  {
    key: "breadcrumbs",
    label: "Breadcrumbs",
    description: "The small \"Home / Services / …\" trail at the top of inner pages.",
    fields: [
      { key: "home", label: "Home", default: "Home" },
      { key: "services", label: "Services", default: "Services" },
      { key: "portfolio", label: "Portfolio", default: "Portfolio" },
      { key: "industries", label: "Industries", default: "Industries" },
      { key: "blog", label: "Blog", default: "Blog" },
    ],
  },
  {
    key: "notFound",
    label: "Page not found (404)",
    description: "Shown when someone opens a link that doesn't exist.",
    fields: [
      { key: "pageTitle", label: "Browser tab title", default: "Page not found" },
      { key: "eyebrow", label: "Small title", default: "404" },
      { key: "heading", label: "Heading", default: "We couldn't find that page" },
      { key: "text", label: "Text", default: "It may have moved, or the link may be out of date." },
      { key: "homeButton", label: "Home button text", default: "Back to home" },
      { key: "contactButton", label: "Contact button text", default: "Contact us" },
    ],
  },
  {
    key: "errorPage",
    label: "Error page",
    description: "Shown if a page fails to load because of a temporary problem.",
    fields: [
      { key: "eyebrow", label: "Small title", default: "Something went wrong" },
      { key: "heading", label: "Heading", default: "This page didn't load properly" },
      {
        key: "text",
        label: "Text",
        type: "textarea",
        default: "Please try again in a moment. If it keeps happening, get in touch and we'll sort it out.",
      },
      { key: "retryButton", label: "Retry button text", default: "Try again" },
    ],
  },
  {
    key: "cookies",
    label: "Cookie banner",
    description: "Shown only when Google Analytics is turned on (SEO settings). Analytics loads only after a visitor accepts.",
    fields: [
      {
        key: "message",
        label: "Message",
        type: "textarea",
        default: "We use analytics cookies to understand how visitors use this website, so we can improve it. Is that OK?",
      },
      { key: "accept", label: "Accept button", default: "Accept" },
      { key: "decline", label: "Decline button", default: "No thanks" },
      { key: "policyLink", label: "Privacy link text", default: "Privacy Policy" },
      { key: "settingsLink", label: "Footer link to change the choice", default: "Cookie settings" },
    ],
  },
  {
    key: "general",
    label: "Other",
    description: "Small bits of text used across the site.",
    fields: [
      { key: "whatsappLabel", label: "WhatsApp button label (for screen readers)", default: "Chat with us on WhatsApp" },
      { key: "whatsappMessage", label: "WhatsApp pre-filled message", default: "Hi! I'd like to talk about a project." },
      { key: "heroScroll", label: "Home hero \"scroll\" hint", default: "Scroll" },
    ],
  },
  {
    key: "accessibility",
    label: "Screen reader labels",
    description: "Invisible labels read aloud to visitors using screen readers. Rarely need changing.",
    fields: [
      { key: "skipToContent", label: "\"Skip to content\" link (shown when tabbing with the keyboard)", default: "Skip to content" },
      { key: "openMenu", label: "Mobile menu button (closed)", default: "Open menu" },
      { key: "closeMenu", label: "Mobile menu button (open)", default: "Close menu" },
      { key: "siteMenu", label: "Mobile menu", default: "Site menu" },
      { key: "newsletterEmail", label: "Newsletter email box", default: "Email address" },
      { key: "previousTestimonial", label: "Testimonials: previous button", default: "Previous testimonial" },
      { key: "nextTestimonial", label: "Testimonials: next button", default: "Next testimonial" },
      {
        key: "goToTestimonial",
        label: "Testimonials: dot buttons",
        default: "Go to testimonial {number}",
        help: "{number} is the testimonial's position.",
      },
      { key: "heroScroll", label: "Home hero \"scroll\" arrow", default: "Scroll to explore" },
      {
        key: "heroImageAlt",
        label: "Home hero background picture description",
        default: "Cee-Shell creative studio — branding, photography and packaging design at work",
      },
      { key: "mapTitle", label: "Contact page map", default: "Cee-Shell studio location" },
    ],
  },
] as const satisfies readonly TextGroupDef[];

type Groups = (typeof SITE_TEXT_GROUPS)[number];
type FieldValue<F> = F extends { type: "list" } ? string[] : string;

export type SiteTexts = {
  [G in Groups as G["key"]]: { [F in G["fields"][number] as F["key"]]: FieldValue<F> };
};

export type SiteTextOverrides = Partial<{ [G in keyof SiteTexts]: Partial<SiteTexts[G]> }>;

/** Defaults merged with whatever the editor has changed (unknown/invalid keys are ignored). */
export function resolveSiteTexts(overrides: unknown): SiteTexts {
  const stored = (overrides && typeof overrides === "object" ? overrides : {}) as Record<string, Record<string, unknown>>;
  const result: Record<string, Record<string, string | string[]>> = {};
  for (const group of SITE_TEXT_GROUPS) {
    const saved = stored[group.key] ?? {};
    result[group.key] = {};
    for (const field of group.fields as readonly TextFieldDef[]) {
      const value = saved[field.key];
      const isList = field.type === "list";
      const valid = isList
        ? Array.isArray(value) && value.every((v) => typeof v === "string")
        : typeof value === "string" && value.trim() !== "";
      result[group.key][field.key] = valid ? (value as string | string[]) : isList ? [...(field.default as readonly string[])] : (field.default as string);
    }
  }
  return result as unknown as SiteTexts;
}

/** Replaces {placeholders}: fill("Ready to start your {service} project?", { service: "Photography" }). */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
