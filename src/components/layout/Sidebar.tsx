"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { DASHBOARD_NAV } from "@/lib/constants";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Gamepad2,
  BarChart3,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { isAuth, role, logoutAction } = useAuth();

  // If not authenticated, we could return null, but middleware should protect this route.
  if (!isAuth) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-glass-border bg-background-secondary/30">
      {/* Back to Home */}
      <div className="p-4 border-b border-glass-border">
        <Link href="/" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-foreground bg-background-tertiary hover:bg-primary/10 hover:text-primary border border-glass-border rounded-xl transition-all duration-300 group shadow-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Main Site</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-glass-border bg-gradient-to-b from-background-secondary/10 to-transparent">
        <div className="flex items-center gap-4">
          <Avatar
            fallback={role === "Admin" ? "A" : "U"}
            size="md"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-bold text-foreground truncate leading-none">
              Welcome
            </span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-flex self-start mt-1">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {DASHBOARD_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon ? iconMap[item.icon] : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "text-foreground bg-background-tertiary shadow-sm"
                  : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary/50"
              )}
            >
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-glass-border">
        <button
          onClick={() => logoutAction()}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-foreground-muted rounded-lg hover:text-accent-rose hover:bg-accent-rose/10 transition-all duration-200"
          id="sidebar-logout"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
