"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, Tags, Settings } from "lucide-react";
import { Card } from "@/components/ui";

const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Content Manager", href: "/admin/content", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Card className="p-4 sticky top-24">
      <nav className="space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/admin");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-rose/10 text-accent-rose"
                  : "text-foreground-muted hover:bg-background-tertiary hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
