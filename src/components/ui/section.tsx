import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  size?: "default" | "compact" | "spacious";
}

const sizeMap = {
  default: "py-20 sm:py-28 lg:py-32",
  compact: "py-14 sm:py-20 lg:py-24",
  spacious: "py-28 sm:py-36 lg:py-44",
};

export function Section({ as = "section", size = "default", className, children, ...props }: SectionProps) {
  const Tag = as;
  return (
    <Tag className={cn("relative overflow-hidden", sizeMap[size], className)} {...props}>
      {children}
    </Tag>
  );
}
