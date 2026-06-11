"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { isAuth, role } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 md:hidden",
          "glass-card rounded-none border-x-0 border-t-0",
          "transition-all duration-300 ease-out",
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="p-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "text-foreground bg-background-tertiary"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-glass-border my-2" />

          <div className="flex flex-col gap-2 px-4">
            {isAuth ? (
              <>
                <Link href="/dashboard" className="w-full" onClick={onClose}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                {role === "Admin" && (
                  <Link href="/admin" className="w-full" onClick={onClose}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1" onClick={onClose}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={onClose}>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
