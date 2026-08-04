import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn(className)} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
      <path
        d="M20 29c-4.97 0-9-4.03-9-9s3.13-7.5 7-7.5 6 2.46 6 5.5-2.24 5-5 5-4-1.57-4-3.75 1.34-3.75 3-3.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
