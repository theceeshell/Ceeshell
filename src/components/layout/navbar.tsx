"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export interface NavItem {
  label: string;
  href: string;
  openNewTab?: boolean;
}

interface NavbarProps {
  websiteName: string;
  navItems: NavItem[];
  email: string;
  phone: string;
  logoUrl?: string | null;
}

export function Navbar({ websiteName, navItems, email, phone, logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid ? "bg-background/90 backdrop-blur-md shadow-[0_1px_0_var(--color-border)]" : "bg-transparent"
        )}
      >
        <div className={cn("container-agency flex items-center justify-between transition-all duration-500", solid ? "py-3.5" : "py-6")}>
          <Link href="/" className="relative z-10 flex items-center gap-2.5" onClick={() => setOpen(false)}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={websiteName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <Logo className={cn("h-8 w-8 transition-colors duration-500", solid ? "text-primary" : "text-white")} />
            )}
            <span
              className={cn(
                "font-heading text-2xl font-medium tracking-tight transition-colors duration-500",
                solid ? "text-primary" : "text-white"
              )}
            >
              {websiteName}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.openNewTab ? "_blank" : undefined}
                className={cn(
                  "text-[0.8rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
                  solid ? "text-text hover:text-secondary" : "text-white/85 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild variant={solid ? "primary" : "light"} size="sm">
              <Link href="/contact">Start Project</Link>
            </Button>
          </div>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden",
              solid ? "text-primary" : "text-white"
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-primary px-6 pb-10 pt-28 text-white sm:px-12"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    target={item.openNewTab ? "_blank" : undefined}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between border-b border-white/10 py-4 font-heading text-4xl font-medium sm:text-5xl"
                  >
                    {item.label}
                    <ArrowUpRight className="h-7 w-7 -translate-x-1 translate-y-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="space-y-1 text-sm text-white/70">
                <p>{email}</p>
                <p>{phone}</p>
              </div>
              <Button asChild variant="light" size="lg" onClick={() => setOpen(false)}>
                <Link href="/contact">Start Your Project</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
