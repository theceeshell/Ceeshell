import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
}

export function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-secondary/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-heading text-2xl font-medium text-primary">{value}</p>
        <p className="text-xs font-medium text-muted">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
