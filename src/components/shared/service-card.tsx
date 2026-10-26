import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { iconMap } from "@/components/shared/icon-map";

export interface ServiceCardData {
  slug: string;
  shortName: string;
  tagline: string;
  icon: string;
}

export function ServiceCard({ service, index, linkLabel }: { service: ServiceCardData; index: number; linkLabel: string }) {
  const Icon = iconMap[service.icon];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border bg-surface p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:p-10"
    >
      <div className="flex items-start justify-between">
        <span className="font-heading text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-14 space-y-3">
        <h3 className="font-heading text-2xl font-medium text-primary sm:text-3xl">{service.shortName}</h3>
        <p className="text-sm leading-relaxed text-muted">{service.tagline}</p>
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-secondary">
        <span>{linkLabel}</span>
        <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
