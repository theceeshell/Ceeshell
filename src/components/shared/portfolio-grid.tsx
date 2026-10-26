"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectCard, type ProjectCardData } from "@/components/shared/project-card";

interface PortfolioGridProps {
  projects: ProjectCardData[];
  /** projectPage.filterAll / projectPage.filterEmpty texts. */
  allLabel: string;
  emptyText: string;
}

export function PortfolioGrid({ projects, allLabel, emptyText }: PortfolioGridProps) {
  // null = the "All" filter (kept separate from the label so a category can't collide with it).
  const [active, setActive] = React.useState<string | null>(null);

  const categories = React.useMemo(() => Array.from(new Set(projects.flatMap((p) => p.categories))).sort(), [projects]);

  const filtered = active === null ? projects : projects.filter((p) => p.categories.includes(active));

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {[null, ...categories].map((category) => (
          <button
            key={category ?? "__all__"}
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-300",
              active === category
                ? "border-primary bg-primary text-white"
                : "border-border bg-transparent text-muted hover:border-primary hover:text-primary"
            )}
          >
            {category ?? allLabel}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted">{emptyText}</p>
      )}
    </div>
  );
}
