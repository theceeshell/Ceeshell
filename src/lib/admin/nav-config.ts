import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileStack,
  Briefcase,
  Layers,
  Newspaper,
  Quote,
  Users,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  Settings,
  Compass,
  PanelBottom,
  Search,
  ShieldCheck,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Content Manager", href: "/admin/content", icon: FileStack },
      { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Contact Inquiries", href: "/admin/inquiries", icon: Inbox },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Website Settings", href: "/admin/settings", icon: Settings },
      { label: "Navigation", href: "/admin/navigation", icon: Compass },
      { label: "Footer", href: "/admin/footer", icon: PanelBottom },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Users", href: "/admin/users", icon: ShieldCheck, adminOnly: true },
    ],
  },
];
