import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";
import { blocksToContent, toJson } from "./seed-helpers";

import { services } from "../src/lib/data/services";
import { portfolioProjects } from "../src/lib/data/portfolio";
import { industries } from "../src/lib/data/industries";
import { blogPosts } from "../src/lib/data/blog";
import { generalFaqs } from "../src/lib/data/faq";
import { timeline, values, team as staticTeam } from "../src/lib/data/about";
import { stats, processSteps, processPreview, whyChooseUs, clientLogos } from "../src/lib/data/stats";
import { mainNav } from "../src/lib/site-config";
import { img } from "../src/lib/images";

// Team names localized for a Lahore-based studio. Fictional placeholders only.
const TEAM_NAME_OVERRIDES: Record<string, { name: string; initials: string }> = {
  "Elena Marchetti": { name: "Ayesha Raza", initials: "AR" },
  "Julian Cole": { name: "Bilal Ahmed", initials: "BA" },
  "Priya Nandakumar": { name: "Sana Tariq", initials: "ST" },
  "Marco Bellini": { name: "Hamza Sheikh", initials: "HS" },
  "Sofia Reyes": { name: "Mahnoor Iqbal", initials: "MI" },
  "Tomas Berg": { name: "Usman Farooq", initials: "UF" },
};

const BUDGET_RANGES = [
  "Under PKR 150,000",
  "PKR 150,000 – 500,000",
  "PKR 500,000 – 1,500,000",
  "PKR 1,500,000 – 4,000,000",
  "PKR 4,000,000+",
];

async function main() {
  console.log("Seeding admin user…");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@cee-shell.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Studio Admin",
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Seeding site settings…");
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      websiteName: "Cee-Shell",
      companyName: "Cee-Shell Creative Studio",
      tagline: "Creative Branding, Photography & Packaging Studio",
      email: "hello@cee-shell.com",
      phone: "+92 300 1234567",
      whatsapp: "+92 300 1234567",
      address:
        "Our design studio is based in Gulberg III, Lahore, and we work with clients across Pakistan and beyond.",
      businessHours: "Monday – Saturday, 10:00am – 7:00pm (PKT)",
      googleMapsUrl: "https://www.google.com/maps?q=Gulberg+III,+Lahore,+Pakistan&output=embed",
      socialLinks: {
        instagram: "https://instagram.com/ceeshell",
        linkedin: "https://linkedin.com/company/ceeshell",
        behance: "https://behance.net/ceeshell",
        pinterest: "https://pinterest.com/ceeshell",
      },
      defaultSeoTitle: "Cee-Shell — Creative Branding, Photography & Packaging Studio",
      defaultSeoDescription:
        "Cee-Shell is a full-service creative agency helping ambitious brands communicate better through strategic branding, graphic design, commercial photography, packaging and print.",
      twitterCardType: "summary_large_image",
      robotsIndex: true,
      robotsFollow: true,
    },
  });

  console.log("Seeding footer config…");
  await prisma.footerConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      description:
        "Cee-Shell is a full-service creative agency helping ambitious brands communicate better through strategic branding, graphic design, commercial photography, packaging and print.",
      copyrightText: "Cee-Shell Creative Studio. All rights reserved.",
      privacyPolicyHref: "/privacy-policy",
      termsHref: "/terms",
      quickLinks: [
        { label: "About", href: "/about" },
        { label: "Process", href: "/process" },
        { label: "Industries", href: "/industries" },
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
      ],
      serviceLinks: services.map((s) => ({ label: s.shortName, href: `/services/${s.slug}` })),
    },
  });

  console.log("Seeding navigation…");
  await prisma.navigationItem.deleteMany({});
  await prisma.navigationItem.createMany({
    data: mainNav.map((item, i) => ({ label: item.label, href: item.href, order: i, visible: true })),
  });

  console.log("Resetting content tables for a clean reseed…");
  await prisma.section.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.portfolioProject.deleteMany({});
  await prisma.industry.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.service.deleteMany({});

  console.log("Seeding services…");
  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        shortName: s.shortName,
        icon: s.icon,
        tagline: s.tagline,
        summary: s.summary,
        heroImageUrl: s.heroImage,
        overview: toJson(s.overview),
        benefits: toJson(s.benefits),
        process: toJson(s.process),
        subServices: toJson(s.subServices),
        gallery: toJson(s.gallery),
        faqs: toJson(s.faqs),
        order: i,
        featured: true,
      },
    });
  }
  console.log("Seeding portfolio projects + their testimonials…");
  for (const [i, p] of portfolioProjects.entries()) {
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: p.testimonial.author,
        company: p.client,
        position: p.testimonial.role,
        review: p.testimonial.quote,
        rating: 5,
        featured: ["aurelia-cosmetics", "nord-and-grain", "meridian-watch-co", "verdant-table", "solstice-jewelry", "forge-industrial"].includes(
          p.slug
        ),
        order: i,
      },
    });

    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        client: p.client,
        industry: p.industry,
        year: p.year,
        categories: toJson(p.categories),
        servicesUsed: toJson(p.servicesUsed),
        excerpt: p.excerpt,
        coverImageUrl: p.coverImage,
        coverAspect: p.coverAspect ?? "landscape",
        gallery: toJson(p.gallery),
        challenge: p.challenge,
        research: p.research,
        strategy: p.strategy,
        concept: p.concept,
        designProcess: p.designProcess,
        photography: p.photography,
        printing: p.printing,
        deliverables: toJson(p.deliverables),
        testimonialId: testimonial.id,
        featured: [
          "aurelia-cosmetics",
          "meridian-watch-co",
          "atelier-noir",
          "nord-and-grain",
          "solstice-jewelry",
          "petale-perfumery",
        ].includes(p.slug),
        order: i,
      },
    });
  }
  const projectRows = await prisma.portfolioProject.findMany();
  const projectIdBySlug = Object.fromEntries(projectRows.map((p) => [p.slug, p.id]));

  console.log("Seeding industries…");
  for (const [i, ind] of industries.entries()) {
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {},
      create: {
        slug: ind.slug,
        name: ind.name,
        heroImageUrl: ind.heroImage,
        summary: ind.summary,
        painPoints: toJson(ind.painPoints),
        solutions: toJson(ind.solutions),
        order: i,
        relatedProjects: {
          connect: ind.relatedProjectSlugs
            .filter((slug) => projectIdBySlug[slug])
            .map((slug) => ({ id: projectIdBySlug[slug] })),
        },
      },
    });
  }
  console.log("Seeding team…");
  for (const [i, member] of staticTeam.entries()) {
    const override = TEAM_NAME_OVERRIDES[member.name];
    await prisma.teamMember.create({
      data: {
        name: override?.name ?? member.name,
        position: member.role,
        bio: member.bio,
        order: i,
        active: true,
      },
    });
  }
  const teamRows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  console.log("Seeding blog posts…");
  for (const post of blogPosts) {
    const { contentJson, contentHtml } = blocksToContent(post.content);
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        featuredImageUrl: post.coverImage,
        author: post.author,
        category: post.category,
        tags: [post.category],
        excerpt: post.excerpt,
        contentJson,
        contentHtml,
        publishDate: new Date(post.date),
        status: "published",
        featured: Boolean(post.featured),
      },
    });
  }
  console.log("Seeding FAQs…");
  const localizedFaqs = generalFaqs.map((f) =>
    f.question.startsWith("How much does a project")
      ? {
          ...f,
          answer:
            "Every project is scoped individually based on deliverables, timeline and complexity. Contact us with your project details and we'll provide a tailored proposal in Pakistani Rupees within 3 business days.",
        }
      : f.question.startsWith("Do you require a minimum")
        ? {
            ...f,
            answer:
              "Our engagements typically start from PKR 400,000 for a focused packaging or collateral project, scaling up for full identity systems, multi-location photography or large production runs.",
          }
        : f
  );
  await prisma.faq.deleteMany({});
  await prisma.faq.createMany({
    data: localizedFaqs.map((f, i) => ({ question: f.question, answer: f.answer, category: "General", order: i })),
  });
  const faqRows = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  // -------------------------------------------------------------------------
  // Pages + Sections
  // -------------------------------------------------------------------------
  console.log("Seeding pages + sections…");

  const featuredProjectSlugs = [
    "aurelia-cosmetics",
    "meridian-watch-co",
    "atelier-noir",
    "nord-and-grain",
    "solstice-jewelry",
    "petale-perfumery",
  ];

  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "Home",
      description:
        "Cee-Shell helps businesses build memorable brands through strategy, design, photography and print.",
    },
  });
  await prisma.section.deleteMany({ where: { pageId: homePage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: homePage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "home",
          badge: "Branding · Photography · Packaging · Print",
          heading: "Creative Branding Through Design, Photography & Packaging",
          description: "Cee-Shell helps businesses build memorable brands through strategy, design, photography and print.",
          backgroundImageUrl: img.heroStudio,
          primaryButton: { label: "Start Your Project", href: "/contact" },
          secondaryButton: { label: "View Portfolio", href: "/portfolio" },
        },
      },
      {
        pageId: homePage.id,
        type: "logoSlider",
        name: "Trusted By",
        order: 1,
        content: { heading: "Trusted by brands that take their image seriously", logos: toJson(clientLogos) },
      },
      {
        pageId: homePage.id,
        type: "servicesShowcase",
        name: "Services Overview",
        order: 2,
        content: {
          eyebrow: "What We Do",
          heading: "Five disciplines. One consistent standard.",
          description: "Every service is delivered by the same in-house team, so identity, imagery, packaging and print never drift apart.",
          serviceIds: [],
          viewAllLink: { label: "All Services", href: "/services" },
        },
      },
      {
        pageId: homePage.id,
        type: "cards",
        name: "Why Choose Us",
        order: 3,
        content: {
          eyebrow: "Why Cee-Shell",
          heading: "A studio built to be your only creative vendor.",
          description: "No juggling separate design, photography and print contacts — one accountable team, from strategy to delivery.",
          style: "iconList",
          sideImageUrl: img.designStudio,
          sideImageSecondaryUrl: img.productDesign2,
          cards: toJson(whyChooseUs),
        },
      },
      {
        pageId: homePage.id,
        type: "portfolioShowcase",
        name: "Featured Projects",
        order: 4,
        content: {
          eyebrow: "Selected Work",
          heading: "A portfolio built on real commercial outcomes.",
          displayStyle: "editorialGrid",
          projectIds: featuredProjectSlugs.map((slug) => projectIdBySlug[slug]),
          viewAllLink: { label: "View Full Portfolio", href: "/portfolio" },
        },
      },
      {
        pageId: homePage.id,
        type: "stats",
        name: "Statistics",
        order: 5,
        content: { counters: toJson(stats) },
      },
      {
        pageId: homePage.id,
        type: "testimonials",
        name: "Testimonials",
        order: 6,
        content: { eyebrow: "Client Voices", heading: "Don't take our word for it.", testimonialIds: [] },
      },
      {
        pageId: homePage.id,
        type: "cards",
        name: "Process Preview",
        order: 7,
        content: {
          eyebrow: "How We Work",
          heading: "A process built for clarity, not surprises.",
          style: "numbered",
          viewAllLink: { label: "The Full Process", href: "/process" },
          cards: toJson(processPreview),
        },
      },
      {
        pageId: homePage.id,
        type: "cta",
        name: "Closing CTA",
        order: 8,
        content: { heading: "Let's Build Something Extraordinary" },
      },
    ],
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: { slug: "about", title: "About", description: "Cee-Shell is an independent creative studio built on strategy, craft and commercial accountability." },
  });
  await prisma.section.deleteMany({ where: { pageId: aboutPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: aboutPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "About Cee-Shell",
          heading: "A studio built on craft, not shortcuts.",
          description: "Twelve years, four disciplines, one accountable team — helping brands communicate through strategy, design, photography and print.",
          backgroundImageUrl: img.officeTeam,
        },
      },
      {
        pageId: aboutPage.id,
        type: "richText",
        name: "Company Story",
        order: 1,
        content: {
          variant: "splitStory",
          eyebrow: "Our Story",
          heading: "Started in a shared studio. Built for brands that take their image seriously.",
          paragraphs: [
            "Cee-Shell began in 2013 as a two-person design studio taking on packaging work for local food brands. What started as freelance graphic design grew, project by project, into a full-service creative studio spanning branding, photography, packaging and print.",
            "Today, the same principle holds: every discipline lives under one roof so that identity, imagery and physical production never drift out of sync. We've worked with founders launching their first product and manufacturers with three decades of history — the process is the same either way.",
          ],
          imageUrl: img.designStudio,
          imageSide: "left",
        },
      },
      {
        pageId: aboutPage.id,
        type: "cards",
        name: "Mission & Vision",
        order: 2,
        content: {
          heading: "Mission & Vision",
          style: "twoColumn",
          cards: [
            { title: "Mission", description: "To help ambitious brands communicate with the clarity and craft usually reserved for companies ten times their size." },
            { title: "Vision", description: "A studio where strategy, design, photography and production are never separate disciplines — only one continuous standard of craft." },
          ],
        },
      },
      {
        pageId: aboutPage.id,
        type: "cards",
        name: "Values",
        order: 3,
        content: { eyebrow: "What We Believe", heading: "Values that shape every project.", style: "bordered", cards: toJson(values) },
      },
      {
        pageId: aboutPage.id,
        type: "timeline",
        name: "Timeline",
        order: 4,
        content: { eyebrow: "Our Journey", heading: "Twelve years, one continuous studio.", items: toJson(timeline) },
      },
      {
        pageId: aboutPage.id,
        type: "richText",
        name: "Founder's Note",
        order: 5,
        content: {
          variant: "founderQuote",
          eyebrow: "Founder's Note",
          quote:
            "We never set out to be the biggest studio in the room. We set out to be the one clients trust with the details no one else notices — because those details are usually the ones that decide whether a brand looks credible or amateur.",
          authorName: teamRows[0]?.name ?? "Ayesha Raza",
          authorRole: teamRows[0]?.position ?? "Founder & Creative Director",
          initials: teamRows[0]?.name.split(" ").map((n) => n[0]).join("") ?? "AR",
        },
      },
      {
        pageId: aboutPage.id,
        type: "richText",
        name: "Agency Philosophy",
        order: 6,
        content: {
          variant: "philosophyQuote",
          eyebrow: "Agency Philosophy",
          statement: "Good design earns its place. If a decision can't be traced back to strategy, it doesn't belong in the final work.",
        },
      },
      {
        pageId: aboutPage.id,
        type: "teamShowcase",
        name: "Team",
        order: 7,
        content: { eyebrow: "The Team", heading: "Specialists across every discipline.", memberIds: [] },
      },
      {
        pageId: aboutPage.id,
        type: "cards",
        name: "Achievements",
        order: 8,
        content: {
          style: "achievements",
          heading: "Achievements",
          cards: [
            { title: "240+ Projects Delivered", description: "Across cosmetics, food, fashion, industrial and luxury sectors." },
            { title: "85+ Brands Served", description: "From early-stage startups to established manufacturers." },
            { title: "12 Years in Business", description: "Independently owned and operated since founding." },
            { title: "4 Specialist Disciplines", description: "Design, photography, packaging and print under one studio." },
          ],
        },
      },
      { pageId: aboutPage.id, type: "cta", name: "Closing CTA", order: 9, content: { heading: "Let's Build Something Extraordinary" } },
    ],
  });

  const servicesPage = await prisma.page.upsert({
    where: { slug: "services" },
    update: {},
    create: { slug: "services", title: "Services", description: "Photography, graphic design, packaging design, printing and corporate gifts." },
  });
  await prisma.section.deleteMany({ where: { pageId: servicesPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: servicesPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "What We Do",
          heading: "Five disciplines. One accountable studio.",
          description: "From first sketch to final pallet, every service is delivered by the same in-house team — so nothing gets lost between vendors.",
          backgroundImageUrl: img.productDesign2,
        },
      },
      {
        pageId: servicesPage.id,
        type: "servicesShowcase",
        name: "All Services",
        order: 1,
        content: {
          eyebrow: "Full-Service Capability",
          heading: "Choose one service, or let us run the whole system.",
          description: "Most clients start with a single project and stay for the full system — because consistency across services is where a brand actually compounds.",
          serviceIds: [],
        },
      },
      { pageId: servicesPage.id, type: "cta", name: "Closing CTA", order: 2, content: { heading: "Let's Build Something Extraordinary" } },
    ],
  });

  const portfolioPage = await prisma.page.upsert({
    where: { slug: "portfolio" },
    update: {},
    create: { slug: "portfolio", title: "Portfolio", description: "Branding, packaging, photography and print work across industries." },
  });
  await prisma.section.deleteMany({ where: { pageId: portfolioPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: portfolioPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "Our Work",
          heading: "A portfolio built on outcomes, not just aesthetics.",
          description: "Filter by discipline or industry to see how strategy, design, photography and production come together across real client work.",
          backgroundImageUrl: img.fashionEditorial4,
        },
      },
      {
        pageId: portfolioPage.id,
        type: "portfolioShowcase",
        name: "All Projects",
        order: 1,
        content: { heading: "All Projects", displayStyle: "filterable", projectIds: [] },
      },
      { pageId: portfolioPage.id, type: "cta", name: "Closing CTA", order: 2, content: { heading: "Let's Build Something Extraordinary", secondaryButton: { label: "View Services", href: "/services" } } },
    ],
  });

  const industriesPage = await prisma.page.upsert({
    where: { slug: "industries" },
    update: {},
    create: { slug: "industries", title: "Industries", description: "Cee-Shell works across food, cosmetics, healthcare, restaurants, fashion, jewelry, industrial, corporate, electronics and lifestyle brands." },
  });
  await prisma.section.deleteMany({ where: { pageId: industriesPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: industriesPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "Industries",
          heading: "Category expertise across ten industries.",
          description: "Every industry has different shelf dynamics, regulations and buyer psychology. We bring pattern-recognition from dozens of projects in your category.",
          backgroundImageUrl: img.architectureAbstract2,
        },
      },
      {
        pageId: industriesPage.id,
        type: "industriesShowcase",
        name: "All Industries",
        order: 1,
        content: { eyebrow: "Who We Work With", heading: "Find your industry", industryIds: [] },
      },
      { pageId: industriesPage.id, type: "cta", name: "Closing CTA", order: 2, content: { heading: "Let's Build Something Extraordinary" } },
    ],
  });

  const processPage = await prisma.page.upsert({
    where: { slug: "process" },
    update: {},
    create: { slug: "process", title: "Our Process", description: "The nine-stage process Cee-Shell follows on every branding, packaging, photography and print project." },
  });
  await prisma.section.deleteMany({ where: { pageId: processPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: processPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "How We Work",
          heading: "A nine-stage process built for clarity.",
          description: "Every project — regardless of size — moves through the same disciplined stages, so you always know what's happening and why.",
          backgroundImageUrl: img.architectureAbstract1,
        },
      },
      {
        pageId: processPage.id,
        type: "timeline",
        name: "The Journey",
        order: 1,
        content: {
          eyebrow: "The Journey",
          heading: "Discovery to delivery, step by step.",
          layout: "alternating",
          items: processSteps.map((s, i) => ({ year: String(i + 1).padStart(2, "0"), title: s.title, description: s.description })),
        },
      },
      { pageId: processPage.id, type: "cta", name: "Closing CTA", order: 2, content: { heading: "Let's Build Something Extraordinary" } },
    ],
  });

  const blogPage = await prisma.page.upsert({
    where: { slug: "blog" },
    update: {},
    create: { slug: "blog", title: "Blog", description: "Notes on branding, packaging, photography and print production from the Cee-Shell studio team." },
  });
  await prisma.section.deleteMany({ where: { pageId: blogPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: blogPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "Journal",
          heading: "Notes on branding, packaging and photography.",
          description: "Practical thinking from the studio floor — on design decisions, production trade-offs and running a creative business.",
          backgroundImageUrl: img.officeInterior,
        },
      },
      { pageId: blogPage.id, type: "blogShowcase", name: "All Articles", order: 1, content: { heading: "All Articles", postIds: [] } },
    ],
  });

  const contactPage = await prisma.page.upsert({
    where: { slug: "contact" },
    update: {},
    create: { slug: "contact", title: "Contact", description: "Start your project with Cee-Shell." },
  });
  await prisma.section.deleteMany({ where: { pageId: contactPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: contactPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "Get In Touch",
          heading: "Let's start your project.",
          description: "Tell us about your brand, your product and your ambitions. We'll follow up with next steps within 2 business days.",
          backgroundImageUrl: img.officeInterior,
        },
      },
      {
        pageId: contactPage.id,
        type: "contactBlock",
        name: "Contact Information + Form",
        order: 1,
        content: { heading: "Project Inquiry", showMap: true, faqIds: faqRows.slice(0, 5).map((f) => f.id) },
      },
    ],
  });

  const faqPage = await prisma.page.upsert({
    where: { slug: "faq" },
    update: {},
    create: { slug: "faq", title: "FAQ", description: "Answers to common questions about working with Cee-Shell." },
  });
  await prisma.section.deleteMany({ where: { pageId: faqPage.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: faqPage.id,
        type: "hero",
        name: "Hero",
        order: 0,
        content: {
          variant: "page",
          badge: "FAQ",
          heading: "Answers before you ask.",
          description: "Everything prospective clients ask us most, in one place. Still have a question? Reach out directly.",
          backgroundImageUrl: img.designStudio,
        },
      },
      { pageId: faqPage.id, type: "faq", name: "All FAQs", order: 1, content: { heading: "All FAQs", faqIds: [], layout: "sidebarCta" } },
    ],
  });

  console.log("\nDone. Admin login:");
  console.log(`  email:    ${adminEmail}`);
  console.log(`  password: ${adminPassword}`);
  console.log("Change this password after first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
