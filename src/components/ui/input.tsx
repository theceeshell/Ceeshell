import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-[3.25rem] w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-text placeholder:text-muted/70 transition-colors duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-text placeholder:text-muted/70 transition-colors duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-primary", className)}
      {...props}
    />
  );
}
