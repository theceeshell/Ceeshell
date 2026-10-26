"use client";

import * as React from "react";
import Link from "next/link";
import Image from "@/components/ui/image";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogCardData } from "@/lib/cms/adapters";
import type { SiteTexts } from "@/lib/cms/site-texts";

interface BlogGridProps {
  posts: BlogCardData[];
  texts: Pick<SiteTexts["blog"], "filterAll" | "searchPlaceholder" | "searchEmpty">;
}

export function BlogGrid({ posts, texts }: BlogGridProps) {
  const [query, setQuery] = React.useState("");
  // null = the "All" filter (kept separate from the label so a category can't collide with it).
  const [category, setCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(() => Array.from(new Set(posts.map((p) => p.category))), [posts]);

  const filtered = posts.filter((post) => {
    const matchesCategory = category === null || post.category === category;
    const matchesQuery =
      query.trim() === "" ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "__all__"}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-300",
                category === c
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-transparent text-muted hover:border-primary hover:text-primary"
              )}
            >
              {c ?? texts.filterAll}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={texts.searchPlaceholder}
            aria-label={texts.searchPlaceholder}
            className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-text placeholder:text-muted/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
              <span>{post.category}</span>
              <span className="text-muted">&middot;</span>
              <span className="text-muted normal-case tracking-normal">{post.readTime}</span>
            </div>
            <h3 className="font-heading text-xl font-medium leading-snug text-primary transition-colors group-hover:text-secondary">
              {post.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted">{texts.searchEmpty}</p>
      )}
    </div>
  );
}
