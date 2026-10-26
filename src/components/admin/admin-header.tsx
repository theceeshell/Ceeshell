"use client";

import { startTransition } from "react";
import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  title: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  onOpenMenu: () => void;
}

export function AdminHeader({ title, name, email, role, onOpenMenu }: AdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="text-primary lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-medium text-primary sm:text-xl">{title}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-sm hover:bg-background">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block font-medium text-text">{name}</span>
            <span className="block text-xs text-muted">{role === "ADMIN" ? "Administrator" : "Editor"}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Invoked directly: a <form> inside the menu is unmounted before it can submit. */}
          <DropdownMenuItem className="text-red-600" onSelect={() => startTransition(() => logoutAction())}>
            <LogOut className="h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
