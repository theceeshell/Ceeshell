import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
} as const;

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: keyof typeof TONES }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize", TONES[tone])}>
      {label}
    </span>
  );
}
