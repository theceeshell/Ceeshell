export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  icon: "camera" | "layers" | "package" | "printer" | "gift";
  tagline: string;
  summary: string;
  heroImage: string;
  overview: string[];
  benefits: { title: string; description: string }[];
  process: { title: string; description: string }[];
  subServices: { title: string; description: string }[];
  gallery: string[];
  faqs: ServiceFaq[];
}

import { img } from "@/lib/images";

export const services: Service[] = [
  {
    slug: "photography",
    name: "Commercial Photography",
    shortName: "Photography",
    icon: "camera",
    tagline: "Imagery that sells the story before a word is read",
    summary:
      "Studio and on-location photography for brands that need their products, people and spaces to look as good in pixels as they do in person.",
    heroImage: img.productFlatlay,
    overview: [
      "Every brand lives or dies by its imagery. We build photographic systems — not one-off shoots — so every product, campaign and catalogue image speaks the same visual language.",
      "Our studio handles direction, styling, lighting and retouching in-house, which means fewer vendors, tighter timelines and imagery that's consistent across every channel it appears on.",
    ],
    benefits: [
      { title: "In-house studio & crew", description: "Full lighting rigs, styling and set builds without outsourcing to third parties." },
      { title: "Consistent visual language", description: "Every shoot follows the same color science and framing rules as your brand guidelines." },
      { title: "Fast turnaround", description: "Retouched, channel-ready galleries delivered in days, not weeks." },
      { title: "Usage-ready formats", description: "Delivered pre-sized for e-commerce, print, social and packaging." },
    ],
    process: [
      { title: "Creative Brief", description: "We align on mood, references, shot list and deliverable formats." },
      { title: "Pre-Production", description: "Styling, prop sourcing, location scouting and lighting tests." },
      { title: "Production Day", description: "Full-day or multi-day shoot with real-time art direction on set." },
      { title: "Retouching & Delivery", description: "Color grading, retouching and export in every format you need." },
    ],
    subServices: [
      { title: "Concept Development", description: "Mood boards, references and shot lists built around your campaign goals." },
      { title: "Campaign Photography", description: "Hero imagery for seasonal launches, brand campaigns and out-of-home." },
      { title: "Lookbook Photography", description: "Editorial-grade lookbooks for fashion and lifestyle collections." },
      { title: "Product Photography", description: "Clean, consistent product imagery for catalogues and e-commerce." },
      { title: "Corporate Photography", description: "Executive portraits, office culture and B2B collateral imagery." },
      { title: "Food Photography", description: "Appetite-driving imagery for menus, packaging and delivery platforms." },
      { title: "Fashion Photography", description: "Studio and location fashion imagery with full styling direction." },
      { title: "Photo Editing", description: "Retouching, color grading and compositing to finishing standard." },
    ],
    gallery: [img.productFlatlay, img.fashionEditorial1, img.foodPhotography1, img.cosmeticsFlatlay, img.productWatch, img.fashionEditorial3],
    faqs: [
      { question: "Do you shoot on location or only in-studio?", answer: "Both. We maintain a fully equipped studio for controlled product and portrait work, and travel for location, restaurant and industrial shoots across the region." },
      { question: "How many images do we receive per shoot day?", answer: "It depends on the brief, but a typical full studio day yields 25–60 fully retouched final images. We agree the exact count during the creative brief." },
      { question: "Can you match our existing brand photography style?", answer: "Yes. Send us your current library or guidelines and we'll build a matching lighting and retouching profile before the shoot." },
    ],
  },
  {
    slug: "graphic-design",
    name: "Graphic Design",
    shortName: "Graphic Design",
    icon: "layers",
    tagline: "Identity systems built to hold up at any size, on any surface",
    summary:
      "Brand identity, marketing collateral and campaign design built on strategy — not decoration. Every mark, layout and typeface choice earns its place.",
    heroImage: img.designStudio,
    overview: [
      "Good design isn't about making things pretty — it's about making a brand instantly recognisable and impossible to confuse with a competitor.",
      "We design complete systems: logo, color, type, imagery and voice, documented in guidelines your whole team — and every future vendor — can follow without us in the room.",
    ],
    benefits: [
      { title: "Strategy before style", description: "Every design decision is traced back to a positioning rationale, not a trend." },
      { title: "Built as a system", description: "Guidelines that scale from a business card to a billboard without falling apart." },
      { title: "Cross-channel consistency", description: "One identity, applied correctly across digital, print and packaging." },
      { title: "Ownership & files", description: "You receive full source files and usage rights — no lock-in." },
    ],
    process: [
      { title: "Discovery & Audit", description: "Competitive audit, stakeholder interviews and positioning workshop." },
      { title: "Concept Design", description: "2–3 distinct creative directions presented with strategic rationale." },
      { title: "Refinement", description: "One direction developed in full detail based on your feedback." },
      { title: "System & Guidelines", description: "Complete brand guideline document and asset library handover." },
    ],
    subServices: [
      { title: "Brand Identity", description: "Logo systems, color palettes, typography and full brand guidelines." },
      { title: "Label Design", description: "Structural and graphic label design for retail and food & beverage." },
      { title: "Marketing Collateral", description: "Brochures, sales decks, catalogues and point-of-sale material." },
      { title: "Social Media Design", description: "Templated content systems that keep feeds consistent at scale." },
      { title: "Print Design", description: "Editorial layouts, annual reports and premium print collateral." },
    ],
    gallery: [img.designStudio, img.printTexture, img.productDesign2, img.packagingBoxes, img.architectureAbstract1, img.perfumeFlowers],
    faqs: [
      { question: "Do you only design logos, or full identity systems?", answer: "We design complete systems — logo, typography, color, imagery style and voice — because a mark alone rarely holds a brand together across every touchpoint." },
      { question: "What do we actually receive at the end?", answer: "A full brand guideline PDF, editable source files (Adobe Illustrator, InDesign, Figma) and export-ready assets for web, print and social." },
      { question: "Can you work from an existing logo we want to keep?", answer: "Yes — we regularly build full systems around an existing mark, refining only where needed rather than starting from zero." },
    ],
  },
  {
    slug: "packaging-design",
    name: "Packaging Design",
    shortName: "Packaging Design",
    icon: "package",
    tagline: "The last piece of marketing before the sale — and the first after it",
    summary:
      "Structural and graphic packaging design for food, cosmetics, FMCG and luxury goods — engineered to perform on shelf, in hand and in transit.",
    heroImage: img.packagingBoxes,
    overview: [
      "Packaging is the only piece of marketing that physically travels home with your customer. We design structure and graphics together, so the box, the label and the unboxing moment all tell the same story.",
      "Every structural concept is tested for shelf stand-out, production cost and manufacturing feasibility before a single die-line is finalised.",
    ],
    benefits: [
      { title: "Structure + graphics, one team", description: "Structural engineering and graphic design developed together, not handed off." },
      { title: "Production-ready files", description: "Die-lines and print files built to your printer's exact specifications." },
      { title: "Shelf-impact testing", description: "Concepts reviewed against competitor sets before final sign-off." },
      { title: "Sustainable options", description: "Recyclable, compostable and reduced-material alternatives on request." },
    ],
    process: [
      { title: "Structural Concept", description: "Format, material and construction options based on product and budget." },
      { title: "Graphic Direction", description: "Label, print and finish concepts applied to the chosen structure." },
      { title: "Prototyping", description: "Physical mock-ups and dielines reviewed and refined by hand." },
      { title: "Print-Ready Handover", description: "Final production files delivered directly to your printer or ours." },
    ],
    subServices: [
      { title: "Structural Packaging", description: "Custom box, pouch and bottle structures engineered for shelf and transit." },
      { title: "Label & Sleeve Design", description: "Primary and secondary label design for regulated and retail products." },
      { title: "Rigid Box & Luxury Packaging", description: "Premium unboxing experiences for gifting and luxury retail." },
      { title: "Sustainable Packaging", description: "Material and structure alternatives that reduce environmental impact." },
      { title: "Dieline & Prototyping", description: "Print-accurate dielines and physical prototypes before mass production." },
    ],
    gallery: [img.packagingBoxes, img.cosmeticsFlatlay, img.perfumeBottle, img.packagingProduct2, img.productStillLife, img.skincareProduct],
    faqs: [
      { question: "Can you design packaging without changing our current structure?", answer: "Yes — many projects are graphics-only, applied to an existing box, pouch or bottle structure your production line already runs." },
      { question: "Do you handle regulatory or nutritional label requirements?", answer: "We build layouts to accommodate your compliance content and coordinate directly with your regulatory team or ours for food, cosmetic and pharma categories." },
      { question: "Will the design work with our existing printer?", answer: "We deliver print-ready files matched to your printer's press, substrate and finishing capabilities, or can recommend printing partners from our own network." },
    ],
  },
  {
    slug: "printing",
    name: "Printing & Production",
    shortName: "Printing",
    icon: "printer",
    tagline: "From proof to pallet, without the production headaches",
    summary:
      "Offset, digital and packaging print production managed end-to-end, so the design you approved is exactly the product that arrives.",
    heroImage: img.printTexture,
    overview: [
      "Design means nothing if the print run doesn't match the proof. Our production team manages press checks, substrate selection and finishing so color, texture and cut are exactly as specified.",
      "We work with a vetted network of commercial and packaging printers, matched to the right press and finish for each project's volume and budget.",
    ],
    benefits: [
      { title: "Press-side quality control", description: "We attend press checks so color and finish match the approved proof." },
      { title: "Volume-flexible", description: "From short-run digital prints to full offset production runs." },
      { title: "Finishing expertise", description: "Foiling, embossing, spot UV and specialty substrates handled correctly." },
      { title: "One point of contact", description: "We manage the printer relationship so you don't have to." },
    ],
    process: [
      { title: "Print Specification", description: "Substrate, finish, quantity and budget confirmed before quoting." },
      { title: "Proofing", description: "Digital and physical proofs reviewed and approved before press." },
      { title: "Press Run", description: "Production run with quality checks at every stage." },
      { title: "Delivery & Fulfilment", description: "Packed, palletised and delivered to your warehouse or retail partners." },
    ],
    subServices: [
      { title: "Commercial Offset Printing", description: "High-volume, high-fidelity print production for collateral and packaging." },
      { title: "Digital Printing", description: "Fast-turnaround short runs and variable data printing." },
      { title: "Packaging Printing", description: "Boxes, labels and flexible packaging printed to production spec." },
      { title: "Promotional Merchandise", description: "Branded print collateral for events, retail and trade shows." },
    ],
    gallery: [img.printTexture, img.packagingBoxes, img.productDesign2, img.designStudio, img.packagingProduct2, img.officeInterior],
    faqs: [
      { question: "What's your minimum print run?", answer: "Digital runs start from as few as 50 units; offset runs are most cost-effective from 1,000 units upward. We'll recommend the right method for your volume." },
      { question: "Can you print and ship internationally?", answer: "Yes, we coordinate freight and customs documentation for international clients through our logistics partners." },
      { question: "Do you offer eco-friendly print substrates?", answer: "Yes — FSC-certified stocks, soy-based inks and recyclable finishes are available on every print category." },
    ],
  },
  {
    slug: "corporate-gifts",
    name: "Corporate Gifts",
    shortName: "Corporate Gifts",
    icon: "gift",
    tagline: "Branded gifting that gets remembered, not recycled",
    summary:
      "Curated, custom-branded gift sets and promotional merchandise designed and produced to reflect the same standard as your core brand.",
    heroImage: img.perfumeFlowers,
    overview: [
      "Most corporate gifting feels like an afterthought — generic merchandise with a logo stamped on top. We design gifting as a brand experience, from concept through to packed, ready-to-ship boxes.",
      "Whether it's a client hamper, an employee welcome kit or an event giveaway, every item and its packaging is considered as one cohesive unboxing moment.",
    ],
    benefits: [
      { title: "End-to-end sourcing", description: "Product sourcing, branding and packaging managed under one project." },
      { title: "On-brand execution", description: "Every gift reflects your existing brand guidelines, not a generic catalogue." },
      { title: "Scalable fulfilment", description: "From 20 executive gifts to 5,000-unit event giveaways." },
      { title: "Custom packaging included", description: "Branded boxes, inserts and tissue designed alongside the gift itself." },
    ],
    process: [
      { title: "Brief & Budget", description: "Occasion, audience and per-unit budget established up front." },
      { title: "Curation", description: "Product and packaging options curated and sampled for approval." },
      { title: "Branding & Production", description: "Custom branding applied across gift and packaging components." },
      { title: "Pack & Deliver", description: "Assembled, packed and delivered to your office or directly to recipients." },
    ],
    subServices: [
      { title: "Corporate Gift Sets", description: "Curated multi-item sets for clients, partners and leadership." },
      { title: "Branded Merchandise", description: "Apparel, drinkware and everyday items custom-branded to spec." },
      { title: "Festive & Occasion Hampers", description: "Seasonal gifting programmes for holidays and milestones." },
      { title: "Employee Welcome Kits", description: "Onboarding kits that make a new hire's first day feel considered." },
      { title: "Custom Gift Packaging", description: "Branded boxes, inserts and wrapping designed to match the gift." },
    ],
    gallery: [img.perfumeFlowers, img.packagingBoxes, img.cosmeticsFlatlay, img.productStillLife, img.jewelryRings, img.coffeeProduct],
    faqs: [
      { question: "What's the minimum order size for corporate gifting?", answer: "We take on projects from 20 units for executive gifting up to several thousand for company-wide or event distribution." },
      { question: "Can you handle direct-to-recipient shipping?", answer: "Yes, we offer pack-and-ship fulfilment directly to individual employee or client addresses from a single spreadsheet upload." },
      { question: "How far in advance should we book seasonal gifting?", answer: "We recommend confirming scope at least 8 weeks before major seasonal gifting periods to guarantee sourcing and production timelines." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
