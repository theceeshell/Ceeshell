import { img } from "@/lib/images";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Branding" | "Packaging" | "Photography" | "Print Production" | "Design Trends" | "Business";
  coverImage: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
  content: { heading: string; body: string }[];
}

export const blogCategories = ["Branding", "Packaging", "Photography", "Print Production", "Design Trends", "Business"] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "packaging-that-sells-itself",
    title: "Packaging That Sells Itself: Five Structural Decisions That Matter More Than Graphics",
    excerpt: "Before a single color or typeface is chosen, structure decides whether packaging succeeds on shelf. Here's what to get right first.",
    category: "Packaging",
    coverImage: img.packagingBoxes,
    date: "2026-06-18",
    readTime: "6 min read",
    author: "Priya Nandakumar",
    featured: true,
    content: [
      { heading: "Structure decides before graphics get a chance", body: "Most brands brief packaging as a graphics problem. In reality, the structural format — box, pouch, bottle, sleeve — determines shelf visibility, perceived value and manufacturing cost before a single color decision is made." },
      { heading: "Shelf visibility beats shelf beauty", body: "A beautifully designed package that turns sideways on a crowded shelf loses to a plainer one that faces forward. We test every structural concept against a real competitor set, not an isolated mockup." },
      { heading: "Material choice is a brand decision", body: "Substrate and finish communicate quality signals before customers read a word of copy. Soft-touch laminate, kraft board and glass all carry very different — and often unconscious — quality associations." },
      { heading: "Prototype before you commit to a production run", body: "Physical prototypes catch problems no screen mockup will reveal: how a box feels in hand, whether a lid seats correctly, whether a label wraps cleanly around a curved surface." },
      { heading: "Design for the unboxing, not just the shelf", body: "For direct-to-consumer brands, the shelf moment is replaced by an unboxing video. Interior graphics, tissue, and insert cards deserve the same design attention as the exterior." },
    ],
  },
  {
    slug: "anatomy-of-a-brand-identity-system",
    title: "The Anatomy of a Brand Identity System (And Why a Logo Alone Isn't One)",
    excerpt: "A logo is one output of a brand identity system, not the system itself. Here's what a complete identity actually includes.",
    category: "Branding",
    coverImage: img.designStudio,
    date: "2026-05-27",
    readTime: "7 min read",
    author: "Elena Marchetti",
    content: [
      { heading: "A mark is not a system", body: "A logo can be redrawn in an afternoon. A brand identity system — color, typography, imagery style, voice and application rules — takes weeks to build correctly because it has to survive contact with dozens of future use cases." },
      { heading: "Typography is doing more work than you think", body: "Typeface choice affects legibility, tone and even perceived price point. A well-considered type system often does more to differentiate a brand than the logo mark itself." },
      { heading: "Guidelines exist for the vendors you haven't hired yet", body: "The real test of an identity system is whether a printer, web developer or social media manager you've never met can apply it correctly without you in the room." },
      { heading: "Consistency compounds over time", body: "Brand recognition is built through repetition of the same visual decisions across hundreds of touchpoints — not through novelty. A disciplined system makes that repetition possible." },
    ],
  },
  {
    slug: "lighting-decisions-behind-product-photography",
    title: "The Lighting Decisions Behind Product Photography That Actually Converts",
    excerpt: "The difference between amateur and professional product photography usually comes down to three lighting decisions.",
    category: "Photography",
    coverImage: img.productFlatlay,
    date: "2026-05-09",
    readTime: "5 min read",
    author: "Julian Cole",
    content: [
      { heading: "Soft light isn't always the right light", body: "Diffused, even lighting is the default assumption for product photography, but harder directional light often does more to reveal texture — critical for cosmetics, food and materials-driven products." },
      { heading: "Color accuracy is non-negotiable", body: "A product that photographs a shade off from its real-world color creates returns and erodes trust. Calibrated lighting and monitors are a baseline requirement, not a nice-to-have." },
      { heading: "Consistency across a catalogue matters more than any single hero shot", body: "For e-commerce and catalogue work, a documented lighting setup that can be replicated exactly across hundreds of SKUs matters more than any individual striking image." },
      { heading: "Shoot for every channel from day one", body: "Planning crop ratios and negative space for social, web and print during the shoot avoids expensive reshoots later." },
    ],
  },
  {
    slug: "choosing-the-right-print-finish",
    title: "Foil, Emboss or Spot UV: Choosing the Right Print Finish for Your Budget",
    excerpt: "Specialty print finishes can elevate perceived quality dramatically — or blow a budget with no return. Here's how to choose.",
    category: "Print Production",
    coverImage: img.printTexture,
    date: "2026-04-22",
    readTime: "6 min read",
    author: "Sofia Reyes",
    content: [
      { heading: "Finish should reinforce positioning, not just impress", body: "Foil stamping and embossing are frequently chosen because they look impressive in a sample book, not because they reinforce the brand's actual positioning. The best finish choice usually disappears into the story rather than announcing itself." },
      { heading: "Understand the cost curve before you fall in love with a finish", body: "Specialty finishes carry setup costs that only amortise well at meaningful print volumes. A finish that makes sense at 10,000 units may be uneconomical at 500." },
      { heading: "Test on your actual substrate", body: "Foil and emboss behave differently on coated versus uncoated stock. Always test the finish on the exact substrate and press you'll use for production, not a generic sample." },
      { heading: "Less is usually more", body: "One well-executed finish applied with restraint reads as more premium than three competing finishes fighting for attention on the same surface." },
    ],
  },
  {
    slug: "design-trends-worth-ignoring-2026",
    title: "Design Trends Worth Ignoring in 2026 (And What to Do Instead)",
    excerpt: "Chasing trend cycles is expensive and short-lived. Here's why timeless design decisions consistently outperform trend-driven ones.",
    category: "Design Trends",
    coverImage: img.architectureAbstract1,
    date: "2026-03-30",
    readTime: "5 min read",
    author: "Marco Bellini",
    content: [
      { heading: "Trend-chasing is a redesign subscription you didn't sign up for", body: "A brand identity built around a visual trend has a built-in expiration date. Within two to three years, it will need a costly redesign simply to avoid looking dated." },
      { heading: "Timeless doesn't mean boring", body: "Restraint and confidence in typography, color and composition age far better than novelty. Some of the most enduring identities in the world are also among the simplest." },
      { heading: "Build in flexibility instead of chasing style", body: "Rather than committing to a trend, build systems flexible enough to express seasonal or campaign-level creativity without touching the core identity." },
      { heading: "Ask what problem the trend is actually solving", body: "Before adopting a popular visual style, ask what business problem it solves. If the answer is 'it looks current,' that's a signal to look elsewhere." },
    ],
  },
  {
    slug: "briefing-your-design-agency-properly",
    title: "How to Brief a Design Agency So You Actually Get What You Need",
    excerpt: "The quality of a creative brief predicts the quality of the outcome more reliably than almost anything else in the process.",
    category: "Business",
    coverImage: img.officeTeam,
    date: "2026-03-11",
    readTime: "6 min read",
    author: "Elena Marchetti",
    content: [
      { heading: "A brief should describe the problem, not the solution", body: "Briefs that specify 'we want a blue logo with a leaf' skip past the strategic thinking that makes an agency valuable in the first place. Describe the business problem and let the studio propose the solution." },
      { heading: "Bring your constraints, not just your inspiration", body: "Budget, timeline, regulatory requirements and production capability are as important to a brief as mood boards and reference images — and are often left out." },
      { heading: "Decide who has final sign-off before the project starts", body: "Projects slow down most when feedback comes from multiple stakeholders with conflicting priorities. Naming a single decision-maker up front avoids costly rounds of contradictory revisions." },
      { heading: "Share the failures, not just the successes", body: "Telling an agency what hasn't worked in the past — and why — is often more useful than showing them what you like." },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return blogPosts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit)
    .concat(blogPosts.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit);
}
