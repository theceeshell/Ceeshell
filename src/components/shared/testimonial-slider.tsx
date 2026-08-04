"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialCardData {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export function TestimonialSlider({ testimonials }: { testimonials: TestimonialCardData[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = React.useState(0);

  const scrollTo = React.useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] px-2">
              <figure className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-[2rem] border border-border bg-surface px-8 py-14 text-center shadow-soft sm:px-16 sm:py-16">
                <Quote className="h-10 w-10 text-accent" strokeWidth={1.5} />
                <blockquote className="text-balance font-heading text-2xl font-medium leading-snug text-primary sm:text-3xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex flex-col items-center gap-1">
                  <span className="font-semibold text-text">{t.author}</span>
                  <span className="text-sm text-muted">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          aria-label="Previous testimonial"
          onClick={scrollPrev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                selected === i ? "w-6 bg-primary" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>
        <button
          aria-label="Next testimonial"
          onClick={scrollNext}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
