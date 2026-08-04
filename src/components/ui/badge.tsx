import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/5 text-primary",
        light: "border-white/30 bg-white/10 text-white backdrop-blur-sm",
        outline: "border-border bg-transparent text-muted",
        accent: "border-accent/30 bg-accent/10 text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
