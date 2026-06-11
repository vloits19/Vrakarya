"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/providers/AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuth, role } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl border pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-background-secondary/40 backdrop-blur-xl">
            <div className="px-4 sm:px-6">
              <div className="flex items-center justify-between h-14">
                {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
                id="nav-logo"
              >
                <div className="h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image src="/LogoVrakarya.svg" alt="Vrakarya Logo" width={140} height={32} className="h-full w-auto" priority />
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1" id="nav-desktop">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "text-foreground bg-background-tertiary"
                          : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {isAuth ? (
                  <div className="flex items-center gap-2">
                    {role === "Admin" && (
                      <Link href="/admin">
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard">
                      <Button variant="secondary" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="hidden sm:block">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" className="hidden sm:block">
                      <Button variant="primary" size="sm">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}

                {/* Mobile Hamburger */}
                <button
                  className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  id="nav-mobile-toggle"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
