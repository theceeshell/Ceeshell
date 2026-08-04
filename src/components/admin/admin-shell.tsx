"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { ADMIN_NAV } from "@/lib/admin/nav-config";

function pageTitleFor(pathname: string) {
  const items = ADMIN_NAV.flatMap((g) => g.items);
  const match = items
    .filter((item) => (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Admin";
}

interface AdminShellProps {
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  children: React.ReactNode;
}

export function AdminShell({ name, email, role, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={pageTitleFor(pathname)}
          name={name}
          email={email}
          role={role}
          onOpenMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
