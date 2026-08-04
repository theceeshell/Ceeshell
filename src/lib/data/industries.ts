import { img } from "@/lib/images";

export interface Industry {
  slug: string;
  name: string;
  heroImage: string;
  summary: string;
  painPoints: string[];
  solutions: string[];
  relatedProjectSlugs: string[];
}

export const industries: Industry[] = [
  {
    slug: "food",
    name: "Food & Beverage",
    heroImage: img.foodPhotography1,
    summary: "Packaging and photography that make products look as good as they taste, on shelf or on screen.",
    painPoints: [
      "Products get lost among visually similar competitors on crowded grocery shelves.",
      "Menu and delivery-app photography looks inconsistent across locations and platforms.",
      "Packaging looks appetising in isolation but disappears in real retail lighting.",
    ],
    solutions: [
      "Shelf-tested packaging design built against real competitor sets, not isolated mockups.",
      "Repeatable food photography systems your own team can maintain between shoots.",
      "Structural and label design considered together for real-world shelf stand-out.",
    ],
    relatedProjectSlugs: ["nord-and-grain", "cardamom-and-co", "verdant-table"],
  },
  {
    slug: "cosmetics",
    name: "Cosmetics & Beauty",
    heroImage: img.cosmeticsFlatlay,
    summary: "Identity, packaging and photography for beauty brands competing against prestige-tier shelf sets.",
    painPoints: [
      "Formulation quality is strong, but packaging reads as amateur next to prestige competitors.",
      "Inconsistent product photography across e-commerce, retail and social channels.",
      "Regulatory label requirements constrain design more than founders expect.",
    ],
    solutions: [
      "Packaging systems designed to prestige-tier standard on realistic production budgets.",
      "Studio photography systems calibrated for consistent color across every channel.",
      "Label layouts built to accommodate compliance content without compromising design.",
    ],
    relatedProjectSlugs: ["aurelia-cosmetics", "lumen-skincare", "petale-perfumery"],
  },
  {
    slug: "healthcare",
    name: "Healthcare & Wellness",
    heroImage: img.skincareProduct,
    summary: "Clear, trustworthy design and photography for healthcare and wellness brands operating under scrutiny.",
    painPoints: [
      "Clinical credibility needs to come through visually, not just in copy.",
      "Regulatory and compliance requirements often collide with brand ambition.",
      "Patient- and consumer-facing materials need to be accessible and unambiguous.",
    ],
    solutions: [
      "Design systems that read as credible and calm without feeling cold or generic.",
      "Layouts built from day one around compliance and accessibility requirements.",
      "Photography and collateral tested for clarity with real patient and consumer audiences.",
    ],
    relatedProjectSlugs: ["lumen-skincare"],
  },
  {
    slug: "restaurants",
    name: "Restaurants & Hospitality",
    heroImage: img.restaurantPlating,
    summary: "Menu photography, print collateral and identity systems for multi-location hospitality groups.",
    painPoints: [
      "Photography and menu design vary wildly between locations under the same brand.",
      "In-house teams lack a repeatable system for shooting new seasonal dishes.",
      "Print collateral quality doesn't match the in-room or in-restaurant experience.",
    ],
    solutions: [
      "One documented photography and design standard rolled out across every location.",
      "Style guides that let in-house teams shoot new dishes consistently between engagements.",
      "Premium print production matched to the calibre of the physical space itself.",
    ],
    relatedProjectSlugs: ["verdant-table", "halcyon-hotels"],
  },
  {
    slug: "fashion",
    name: "Fashion & Apparel",
    heroImage: img.fashionEditorial2,
    summary: "Lookbook photography and identity systems for labels selling into competitive wholesale markets.",
    painPoints: [
      "Lookbook photography and identity shift inconsistently from season to season.",
      "Wholesale buyers cite inconsistent presentation as a barrier to larger orders.",
      "Small teams can't maintain a consistent photographic style without outside direction.",
    ],
    solutions: [
      "Modular lookbook systems that stay consistent across seasons and collections.",
      "Identity systems built to reassure wholesale buyers at every touchpoint.",
      "Documented photographic direction your team can reference season after season.",
    ],
    relatedProjectSlugs: ["atelier-noir", "form-and-function"],
  },
  {
    slug: "jewelry",
    name: "Jewelry & Accessories",
    heroImage: img.jewelryRings,
    summary: "Macro photography and packaging for fine jewelry and accessories brands.",
    painPoints: [
      "Product photography fails to capture the craftsmanship that justifies price point.",
      "Packaging feels generic compared to legacy luxury house competitors.",
      "Digital imagery doesn't translate the in-hand experience of the physical piece.",
    ],
    solutions: [
      "Macro and focus-stacked photography that treats each piece as a sculptural object.",
      "Packaging structure and unboxing sequence designed with the same care as the product.",
      "Campaign imagery that closes the gap between screen and showroom experience.",
    ],
    relatedProjectSlugs: ["solstice-jewelry", "meridian-watch-co"],
  },
  {
    slug: "industrial",
    name: "Industrial & Manufacturing",
    heroImage: img.industrialFactory,
    summary: "Corporate identity and print systems for manufacturers whose reputation outpaces their visual presence.",
    painPoints: [
      "Decades of customer trust aren't reflected in outdated visual identity.",
      "Sales collateral looks dated next to newer, design-forward competitors.",
      "Facility and product photography rarely exists in a usable, modern form.",
    ],
    solutions: [
      "Identity modernisation that preserves the equity long-standing customers already trust.",
      "Sales collateral systems piloted with real sales teams before full rollout.",
      "On-site corporate and facility photography built for pitch decks and web alike.",
    ],
    relatedProjectSlugs: ["forge-industrial"],
  },
  {
    slug: "corporate",
    name: "Corporate & Professional Services",
    heroImage: img.officeTeam,
    summary: "Identity, photography and print collateral for corporate and B2B service brands.",
    painPoints: [
      "Stock photography makes leadership and culture feel generic and interchangeable.",
      "Print collateral doesn't match the calibre of the services actually being sold.",
      "Brand identity hasn't kept pace with company growth or repositioning.",
    ],
    solutions: [
      "Custom corporate photography that reflects your actual team and culture.",
      "Collateral systems designed to support high-value sales conversations.",
      "Identity refreshes that respect existing brand equity while modernising execution.",
    ],
    relatedProjectSlugs: ["forge-industrial", "halcyon-hotels"],
  },
  {
    slug: "electronics",
    name: "Electronics & Technology",
    heroImage: img.productDesign2,
    summary: "Packaging and product photography for consumer electronics and technology brands.",
    painPoints: [
      "Technical products are hard to photograph in a way that feels desirable, not clinical.",
      "Packaging needs to protect precision hardware while still feeling premium to unbox.",
      "Retail and e-commerce imagery requirements differ significantly in spec and tone.",
    ],
    solutions: [
      "Photography that balances technical accuracy with genuine desirability.",
      "Protective packaging structures engineered without sacrificing the unboxing moment.",
      "Channel-specific imagery delivered to exact retail and marketplace specifications.",
    ],
    relatedProjectSlugs: ["meridian-watch-co"],
  },
  {
    slug: "lifestyle",
    name: "Lifestyle & Consumer Goods",
    heroImage: img.architectureAbstract2,
    summary: "Brand identity, photography and packaging for lifestyle and consumer goods brands.",
    painPoints: [
      "Brand feels visually indistinct in a crowded, trend-driven consumer category.",
      "Photography style shifts with every new campaign instead of building recognition.",
      "Packaging doesn't reflect the lifestyle positioning the marketing promises.",
    ],
    solutions: [
      "A distinctive visual system built to be recognisable without a logo present.",
      "Campaign photography direction documented for consistent use across teams.",
      "Packaging aligned to the same lifestyle positioning as the marketing that sells it.",
    ],
    relatedProjectSlugs: ["halcyon-hotels", "form-and-function"],
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
