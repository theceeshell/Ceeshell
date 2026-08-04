import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const aspectMap = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export interface ProjectCardData {
  slug: string;
  title: string;
  categories: string[];
  coverImage: string;
  coverAspect?: keyof typeof aspectMap;
}

export function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: ProjectCardData;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={cn("group relative block overflow-hidden rounded-[1.5rem] bg-primary", aspectMap[project.coverAspect ?? "landscape"], className)}
    >
      <Image
        src={project.coverImage}
        alt={`${project.title} — ${project.categories.join(", ")}`}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-7">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">
          {project.categories[0]}
        </span>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-heading text-2xl font-medium text-white sm:text-[1.7rem]">{project.title}</h3>
          <span className="flex h-10 w-10 shrink-0 translate-y-1 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-[18px] w-[18px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}
