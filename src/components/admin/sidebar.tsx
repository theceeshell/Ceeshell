"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/admin/nav-config";
import { Logo } from "@/components/shared/logo";

interface SidebarProps {
  role: "ADMIN" | "EDITOR";
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo className="h-7 w-7 text-white" />
          <span className="font-heading text-xl font-medium text-white">Cee-Shell</span>
        </Link>
        <button onClick={onClose} className="text-white/70 lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {ADMIN_NAV.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/40">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items
                .filter((item) => !item.adminOnly || role === "ADMIN")
                .map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 bg-primary lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-primary shadow-2xl">{content}</aside>
        </div>
      )}
    </>
  );
}
