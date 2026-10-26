import Image from "@/components/ui/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  /** `home` is the label of the leading "Home" link (breadcrumbs.home text). */
  breadcrumbs?: { home: string; trail: Crumb[] };
  size?: "default" | "tall";
  imagePriority?: boolean;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumbs,
  size = "default",
  imagePriority = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-primary text-white",
        size === "tall" ? "min-h-[92vh] pt-40 pb-24" : "min-h-[62vh] pt-40 pb-20"
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        priority={imagePriority}
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />

      <Container className="relative">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-white/60">
            <Link href="/" className="hover:text-white">{breadcrumbs.home}</Link>
            {breadcrumbs.trail.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
                ) : (
                  <span className="text-white/85">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <Reveal>
            <Badge variant="light" className="mb-6">{eyebrow}</Badge>
          </Reveal>
        )}
        <Reveal delay={0.08}>
          <h1 className="max-w-4xl text-balance font-heading text-5xl font-medium leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/75">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
