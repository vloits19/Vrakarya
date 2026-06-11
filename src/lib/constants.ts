import type { NavItem } from "@/types";

// --- Site ---
export const SITE_NAME = "Vrakarya";
export const SITE_DESCRIPTION =
  "A showcase platform for game developers to share projects, connect with the community, and get discovered.";
export const SITE_URL = "https://vrakarya.dev";

// --- Navigation ---
export const NAV_ITEMS: NavItem[] = [
  { label: "Feed", href: "/feed" },
  { label: "Developers", href: "/developers" },
];

// --- Dashboard Sidebar ---
export const DASHBOARD_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Projects", href: "/dashboard/projects", icon: "Gamepad2" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

// --- Project Statuses ---
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  concept: "Concept",
  "in-development": "In Development",
  "early-access": "Early Access",
  released: "Released",
  archived: "Archived",
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  concept: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "in-development": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "early-access": "bg-primary/20 text-primary border-primary/30",
  released: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  archived: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};
