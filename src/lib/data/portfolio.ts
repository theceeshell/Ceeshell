import { img } from "@/lib/images";

export type PortfolioCategory =
  | "Packaging"
  | "Photography"
  | "Brand Identity"
  | "Printing"
  | "Corporate"
  | "Food"
  | "Beauty"
  | "Fashion"
  | "Luxury";

export interface PortfolioProject {
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  categories: PortfolioCategory[];
  servicesUsed: string[];
  excerpt: string;
  coverImage: string;
  coverAspect?: "portrait" | "landscape" | "square";
  gallery: string[];
  challenge: string;
  research: string;
  strategy: string;
  concept: string;
  designProcess: string;
  photography: string;
  printing: string;
  deliverables: string[];
  testimonial: { quote: string; author: string; role: string };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "aurelia-cosmetics",
    title: "Aurelia Cosmetics",
    client: "Aurelia Cosmetics",
    year: "2025",
    industry: "Cosmetics",
    categories: ["Beauty", "Packaging", "Brand Identity"],
    servicesUsed: ["Brand Identity", "Packaging Design", "Product Photography"],
    excerpt: "A full identity and packaging system for a clean-beauty line entering premium retail.",
    coverImage: img.cosmeticsFlatlay,
    coverAspect: "portrait",
    gallery: [img.cosmeticsFlatlay, img.cosmetics2, img.makeupProduct, img.skincareProduct],
    challenge:
      "Aurelia was launching into a premium retail category dominated by legacy prestige brands, with a formulation story strong enough to compete but no visual identity to carry it.",
    research: "We audited 40+ competing SKUs across three price tiers to map the whitespace between clinical minimalism and over-styled luxury.",
    strategy: "Position Aurelia as 'quiet confidence' — restrained, ingredient-forward design that trusts the product rather than shouting over it.",
    concept: "A monogram mark built from the brand's initial, paired with a warm ivory palette and a single accent foil used consistently across the range.",
    designProcess: "Three identity directions were presented before refining the selected system into a full guideline covering typography, color, and packaging application.",
    photography: "Studio product photography with soft directional lighting to emphasise texture and formulation color without artificial gloss.",
    printing: "Soft-touch rigid boxes with copper foil deboss, printed on an FSC-certified recycled board stock.",
    deliverables: ["Brand identity system", "Packaging design (12 SKUs)", "Product photography", "Retail POS design"],
    testimonial: {
      quote: "Cee-Shell understood exactly what 'premium' meant for us — restraint, not decoration. Retail buyers noticed the difference immediately.",
      author: "Priya Shah",
      role: "Founder, Aurelia Cosmetics",
    },
  },
  {
    slug: "nord-and-grain",
    title: "Nord & Grain Bakery",
    client: "Nord & Grain",
    year: "2024",
    industry: "Food & Beverage",
    categories: ["Food", "Packaging", "Brand Identity"],
    servicesUsed: ["Brand Identity", "Packaging Design", "Food Photography"],
    excerpt: "Rebranding a wholesale bakery for a direct-to-consumer retail launch.",
    coverImage: img.foodPhotography1,
    coverAspect: "landscape",
    gallery: [img.foodPhotography1, img.restaurantPlating, img.foodPhotography3, img.packagingProduct2],
    challenge: "Nord & Grain needed to shift from an unbranded wholesale supplier to a retail-ready consumer brand within a single packaging redesign cycle.",
    research: "In-store shelf audits revealed rustic, hand-crafted visual cues consistently outperformed with the target demographic across the bakery aisle.",
    strategy: "Build a warm, artisanal identity anchored in the bakery's Scandinavian sourdough heritage rather than generic 'organic' visual tropes.",
    concept: "A hand-drawn wheat-stalk motif and warm kraft palette paired with a confident wordmark that scales from a bread bag to a delivery van.",
    designProcess: "Structural packaging was redesigned in tandem with graphics to solve a shelf-visibility issue the client had flagged from prior retail feedback.",
    photography: "On-location bakery photography capturing process and product to build a library for packaging, web and social use.",
    printing: "Flexographic printing on compostable bread bags with a spot varnish finish on the retail carton range.",
    deliverables: ["Brand identity", "Packaging design (8 SKUs)", "Food photography", "Delivery vehicle livery"],
    testimonial: {
      quote: "Retail sell-through jumped within the first quarter of the new packaging hitting shelves. The team handled structure and graphics as one project, which made all the difference.",
      author: "Lars Kristiansen",
      role: "Managing Director, Nord & Grain",
    },
  },
  {
    slug: "meridian-watch-co",
    title: "Meridian Watch Co.",
    client: "Meridian Watch Co.",
    year: "2025",
    industry: "Luxury Goods",
    categories: ["Luxury", "Photography", "Packaging"],
    servicesUsed: ["Product Photography", "Packaging Design", "Campaign Photography"],
    excerpt: "Campaign photography and packaging for an independent watchmaker's flagship collection.",
    coverImage: img.productWatch,
    coverAspect: "square",
    gallery: [img.productWatch, img.jewelryRings, img.perfumeFlowers, img.productStillLife],
    challenge: "An independent watchmaker needed campaign imagery and packaging credible enough to sit beside established Swiss houses at a fraction of the marketing budget.",
    research: "Category research showed collectors respond to macro craftsmanship detail over lifestyle imagery, shifting our photographic approach early.",
    strategy: "Let the mechanism be the hero — campaign and packaging built around macro detail rather than aspirational lifestyle scenes.",
    concept: "A presentation case with a recessed walnut tray, photographed under raking light to emphasise dial texture and case finishing.",
    designProcess: "Packaging structure went through four prototype rounds to balance perceived weight against shipping cost.",
    photography: "Macro studio photography using focus-stacking to capture full dial and movement detail in a single composite image.",
    printing: "Debossed leatherette presentation boxes with a satin-finish outer sleeve printed via digital UV.",
    deliverables: ["Campaign photography", "Packaging design", "Product photography", "E-commerce imagery"],
    testimonial: {
      quote: "The imagery alone changed how retailers perceived us before they'd even handled the product.",
      author: "Daniel Ferro",
      role: "Founder, Meridian Watch Co.",
    },
  },
  {
    slug: "verdant-table",
    title: "Verdant Table",
    client: "Verdant Table Restaurant Group",
    year: "2024",
    industry: "Restaurants",
    categories: ["Food", "Corporate", "Photography"],
    servicesUsed: ["Food Photography", "Brand Identity", "Print Design"],
    excerpt: "Menu photography and print collateral for a five-location restaurant group relaunch.",
    coverImage: img.restaurantPlating,
    coverAspect: "landscape",
    gallery: [img.restaurantPlating, img.restaurantFood2, img.restaurantInterior, img.foodPhotography3],
    challenge: "Verdant Table's five locations each carried inconsistent menu design and photography, diluting the group's identity across markets.",
    research: "A cross-location audit found no shared plating, lighting or layout standards, despite a single shared kitchen philosophy.",
    strategy: "Establish one photographic and print standard that could be replicated by each location's in-house team going forward.",
    concept: "Natural window-light plating photography paired with an editorial menu layout built on a flexible modular grid.",
    designProcess: "A reusable style guide and lighting setup was documented so future dishes could be shot consistently without our studio present.",
    photography: "On-location photography across all five restaurants over a two-week production schedule.",
    printing: "Seasonal menus printed on uncoated stock with letterpress detailing for the fine-dining locations.",
    deliverables: ["Food photography library", "Menu design system", "Print collateral", "Photography style guide"],
    testimonial: {
      quote: "For the first time, all five locations feel like they belong to the same restaurant group.",
      author: "Camille Rousseau",
      role: "Marketing Director, Verdant Table Group",
    },
  },
  {
    slug: "solstice-jewelry",
    title: "Solstice Jewelry",
    client: "Solstice Jewelry",
    year: "2023",
    industry: "Jewelry",
    categories: ["Luxury", "Photography", "Brand Identity"],
    servicesUsed: ["Brand Identity", "Campaign Photography", "Packaging Design"],
    excerpt: "Identity and campaign imagery for a fine jewelry house's direct-to-consumer launch.",
    coverImage: img.jewelryRings,
    coverAspect: "square",
    gallery: [img.jewelryRings, img.jewelryNecklace, img.fashionModel, img.perfumeFlowers],
    challenge: "Solstice was moving from wholesale-only distribution to a direct consumer offering and needed a standalone identity distinct from its wholesale partners' branding.",
    research: "Interviews with the founder's existing private clients revealed the brand's strongest equity was in craftsmanship storytelling, not price positioning.",
    strategy: "Build a quiet-luxury identity that photographs as well on a phone screen as it does under a jeweller's loupe.",
    concept: "A celestial-inspired monogram and deep midnight palette, paired with macro photography that treats each piece as a sculptural object.",
    designProcess: "Packaging and campaign photography were developed in parallel so the unboxing experience matched the campaign's visual tone exactly.",
    photography: "Macro and on-model photography combining studio precision shots with soft editorial campaign imagery.",
    printing: "Foil-stamped ring boxes with a custom-woven ribbon closure, produced in a limited first run.",
    deliverables: ["Brand identity", "Campaign photography", "Packaging design", "Digital lookbook"],
    testimonial: {
      quote: "They treated every piece like a sculpture, not a product shot. That's exactly the shift we needed.",
      author: "Anaïs Moreau",
      role: "Creative Director, Solstice Jewelry",
    },
  },
  {
    slug: "lumen-skincare",
    title: "Lumen Skincare",
    client: "Lumen Skincare",
    year: "2025",
    industry: "Cosmetics",
    categories: ["Beauty", "Packaging", "Photography"],
    servicesUsed: ["Packaging Design", "Product Photography", "Label Design"],
    excerpt: "Clinical-modern packaging system for a dermatologist-formulated skincare line.",
    coverImage: img.skincareProduct,
    coverAspect: "portrait",
    gallery: [img.skincareProduct, img.cosmetics2, img.makeupProduct, img.productFlatlay],
    challenge: "Lumen's dermatologist-led formulations needed packaging that read as clinically credible without feeling cold or generic.",
    research: "Pharmacy-aisle and prestige-skincare shelf audits identified an opening for a 'warm clinical' visual tone underserved by current competitors.",
    strategy: "Balance clinical typography and structure with warmer surface tones and tactile finishes to soften the category's usual sterility.",
    concept: "A modular label grid with active-ingredient callouts, applied across a shared bottle and jar architecture for easy line extension.",
    designProcess: "Label hierarchy was tested against pharmacist and consumer feedback panels before finalising the system.",
    photography: "High-key studio photography with soft shadow retention to preserve a clinical, trustworthy tone.",
    printing: "Screen-printed glass packaging with a matte varnish label stock resistant to bathroom humidity.",
    deliverables: ["Packaging design (6 SKUs)", "Label design system", "Product photography", "Shelf-ready POS"],
    testimonial: {
      quote: "Our pharmacist partners said it was the first indie skincare line that 'looked like it knew what it was doing.'",
      author: "Dr. Naomi Adeyemi",
      role: "Founder, Lumen Skincare",
    },
  },
  {
    slug: "atelier-noir",
    title: "Atelier Noir",
    client: "Atelier Noir",
    year: "2024",
    industry: "Fashion",
    categories: ["Fashion", "Photography", "Brand Identity"],
    servicesUsed: ["Brand Identity", "Lookbook Photography", "Campaign Photography"],
    excerpt: "Season lookbook and identity refresh for a contemporary womenswear label.",
    coverImage: img.fashionEditorial1,
    coverAspect: "portrait",
    gallery: [img.fashionEditorial1, img.fashionEditorial2, img.fashionEditorial3, img.fashionEditorial4],
    challenge: "Atelier Noir's existing identity and lookbook photography felt inconsistent season to season, undermining a fast-growing wholesale relationship pipeline.",
    research: "Wholesale buyer feedback consistently cited 'inconsistent brand presentation' as a barrier to larger seasonal orders.",
    strategy: "Establish a repeatable lookbook photography formula and identity system buyers could rely on season after season.",
    concept: "A stripped-back monochrome identity that lets garment silhouette and texture carry each season's visual story.",
    designProcess: "A modular lookbook template was built so future in-house teams could maintain visual consistency without our involvement each season.",
    photography: "Studio and location lookbook photography across two seasonal collections, styled and directed on set.",
    printing: "Limited-run printed lookbooks on uncoated stock for key wholesale accounts, alongside the digital gallery.",
    deliverables: ["Brand identity refresh", "Lookbook photography", "Campaign photography", "Wholesale print catalogue"],
    testimonial: {
      quote: "Buyers noticed the consistency immediately — it changed how seriously they took the brand at market.",
      author: "Josephine Laurent",
      role: "Creative Director, Atelier Noir",
    },
  },
  {
    slug: "forge-industrial",
    title: "Forge Industrial Supply",
    client: "Forge Industrial Supply",
    year: "2023",
    industry: "Industrial Manufacturing",
    categories: ["Corporate", "Printing", "Brand Identity"],
    servicesUsed: ["Brand Identity", "Print Design", "Corporate Photography"],
    excerpt: "Corporate identity and print system for a 30-year-old industrial parts manufacturer.",
    coverImage: img.industrialFactory,
    coverAspect: "landscape",
    gallery: [img.industrialFactory, img.industrialLine, img.officeTeam, img.teamMeeting],
    challenge: "Forge had strong customer loyalty but a visual identity untouched since the 1990s, undermining new business pitches against modern competitors.",
    research: "Client interviews revealed loyalty was built on reliability, not price — an equity the old identity failed to communicate visually.",
    strategy: "Modernise the mark and collateral system while preserving the industrial confidence long-standing clients associated with the brand.",
    concept: "A geometric, engineered wordmark paired with a restrained steel-and-safety-orange palette referencing the factory floor itself.",
    designProcess: "New collateral was piloted with the sales team on live pitches before full rollout across the company's print and signage.",
    photography: "On-site corporate and facility photography documenting the manufacturing floor, equipment and leadership team.",
    printing: "Durable, coated-stock sales collateral and large-format facility signage production.",
    deliverables: ["Brand identity", "Corporate photography", "Sales collateral", "Facility signage"],
    testimonial: {
      quote: "We finally have materials that match the trust our customers already have in us.",
      author: "Robert Hale",
      role: "VP Sales, Forge Industrial Supply",
    },
  },
  {
    slug: "cardamom-and-co",
    title: "Cardamom & Co",
    client: "Cardamom & Co Roasters",
    year: "2025",
    industry: "Food & Beverage",
    categories: ["Food", "Packaging", "Printing"],
    servicesUsed: ["Packaging Design", "Label Design", "Packaging Printing"],
    excerpt: "Packaging system for a specialty coffee roaster's retail bag line.",
    coverImage: img.coffeeProduct,
    coverAspect: "square",
    gallery: [img.coffeeProduct, img.packagingProduct2, img.foodPhotography1, img.productStillLife],
    challenge: "Cardamom & Co needed a retail bag system that communicated origin story and roast profile at a glance across a growing 14-SKU range.",
    research: "Shelf research at specialty grocers showed origin-forward color coding consistently outperformed illustrative packaging in this category.",
    strategy: "Use a origin-coded color system so customers can navigate roast profiles instantly, without reading fine print.",
    concept: "A minimal typographic system with a color-coded band per origin, printed on a matte kraft pouch base.",
    designProcess: "Color-coding logic was tested in-store with real customers before the full 14-SKU rollout was finalised.",
    photography: "Studio product photography plus roastery process imagery for packaging and web use.",
    printing: "Flexographic printing on resealable kraft pouches with a spot-color band per origin.",
    deliverables: ["Packaging design (14 SKUs)", "Label system", "Packaging printing", "Product photography"],
    testimonial: {
      quote: "Customers now ask for bags 'by color' — the system works exactly as intended.",
      author: "Marcus Webb",
      role: "Owner, Cardamom & Co Roasters",
    },
  },
  {
    slug: "halcyon-hotels",
    title: "Halcyon Hotels",
    client: "Halcyon Hotel Group",
    year: "2024",
    industry: "Hospitality",
    categories: ["Corporate", "Photography", "Printing"],
    servicesUsed: ["Corporate Photography", "Print Design", "Brand Identity"],
    excerpt: "Photography and print collateral for a boutique hotel group's brand refresh.",
    coverImage: img.officeInterior,
    coverAspect: "landscape",
    gallery: [img.officeInterior, img.architectureAbstract1, img.architectureAbstract2, img.teamMeeting],
    challenge: "Halcyon's three boutique properties relied on inconsistent stock photography, undermining the premium positioning of their room rates.",
    research: "Guest survey data showed booking hesitation correlated directly with inconsistent, dated photography across the group's booking channels.",
    strategy: "Commission a single cohesive photographic library that could support both digital booking channels and printed in-room collateral.",
    concept: "Architectural, light-led interior photography paired with a refined print collateral system for in-room guest materials.",
    designProcess: "A shot list was mapped to every guest touchpoint — booking site, OTA listings, and in-room directories — to eliminate gaps.",
    photography: "Multi-day on-location photography across all three properties covering interiors, amenities and guest experience.",
    printing: "In-room directories and collateral printed on premium uncoated stock with foil detailing.",
    deliverables: ["Photography library", "In-room print collateral", "Brand guideline update", "OTA imagery package"],
    testimonial: {
      quote: "Direct bookings increased the same quarter the new photography went live across our channels.",
      author: "Isabelle Tran",
      role: "Brand Director, Halcyon Hotel Group",
    },
  },
  {
    slug: "petale-perfumery",
    title: "Pétale Perfumery",
    client: "Pétale Perfumery",
    year: "2023",
    industry: "Cosmetics",
    categories: ["Beauty", "Luxury", "Packaging"],
    servicesUsed: ["Packaging Design", "Product Photography", "Brand Identity"],
    excerpt: "Packaging and campaign identity for an independent niche fragrance house.",
    coverImage: img.perfumeBottle,
    coverAspect: "portrait",
    gallery: [img.perfumeBottle, img.perfumeFlowers, img.cosmeticsFlatlay, img.productStillLife],
    challenge: "Pétale needed packaging distinctive enough to compete with legacy fragrance houses on a boutique production budget.",
    research: "Niche fragrance shelf research showed collectors respond strongly to tactile bottle detail and restrained, confident typography.",
    strategy: "Design one hero bottle silhouette that could carry the entire scent range through color and cap material alone.",
    concept: "A sculptural glass bottle with interchangeable cap materials by scent family, unified under a single engraved wordmark.",
    designProcess: "Three bottle prototypes were produced and tested for hand-feel and shelf presence before the final mould was commissioned.",
    photography: "Studio still-life photography emphasising glass refraction, light and botanical ingredient styling.",
    printing: "Engraved glass with foil-stamped outer cartons on a textured cotton-based stock.",
    deliverables: ["Packaging design", "Brand identity", "Product photography", "Campaign imagery"],
    testimonial: {
      quote: "The bottle alone now gets stopped and photographed on the shelf — that's the whole battle in this category.",
      author: "Élodie Marchand",
      role: "Founder, Pétale Perfumery",
    },
  },
  {
    slug: "form-and-function",
    title: "Form & Function Footwear",
    client: "Form & Function",
    year: "2025",
    industry: "Fashion & Footwear",
    categories: ["Fashion", "Photography", "Packaging"],
    servicesUsed: ["Product Photography", "Packaging Design", "Campaign Photography"],
    excerpt: "Product photography and packaging for a direct-to-consumer footwear launch.",
    coverImage: img.shoesProduct,
    coverAspect: "square",
    gallery: [img.shoesProduct, img.fashionModel, img.fashionEditorial4, img.packagingBoxes],
    challenge: "Form & Function was launching direct-to-consumer with no existing photography or packaging, competing against established e-commerce footwear brands.",
    research: "Competitive teardown of leading DTC footwear brands identified consistent 45-degree hero angles and minimal box graphics as category conventions worth challenging.",
    strategy: "Differentiate through packaging structure and a distinctive low-angle photographic style rather than matching category norms.",
    concept: "A two-piece drawer-style shoebox with an exposed window, photographed at a dynamic low angle rarely used in the category.",
    designProcess: "Packaging prototypes were tested for shipping durability across multiple carrier drop tests before finalising materials.",
    photography: "Studio product photography plus on-model campaign imagery for launch marketing and paid social.",
    printing: "Matte-laminated rigid boxes with a spot-gloss logo treatment, produced in an initial 5,000-unit run.",
    deliverables: ["Product photography", "Packaging design", "Campaign photography", "Launch social assets"],
    testimonial: {
      quote: "The unboxing photos our customers post organically have become half our marketing.",
      author: "Tyler Osei",
      role: "Co-Founder, Form & Function",
    },
  },
];

export const portfolioCategories: PortfolioCategory[] = [
  "Packaging",
  "Photography",
  "Brand Identity",
  "Printing",
  "Corporate",
  "Food",
  "Beauty",
  "Fashion",
  "Luxury",
];

export function getProjectBySlug(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 3) {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  return portfolioProjects
    .filter((p) => p.slug !== slug && p.categories.some((c) => current.categories.includes(c)))
    .slice(0, limit);
}
