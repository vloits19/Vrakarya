import { DashboardStatsCards } from "@/components/sections/DashboardStats";
import { DashboardProjects } from "@/components/sections/DashboardProjects";
import { Card, Button } from "@/components/ui";
import { verifySession } from "@/lib/auth";
import { db } from "@/config/database";
import { getDashboardStats } from "@/app/actions/projects";
import { PlusCircle, BarChart3, Settings, User } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — Vrakarya",
  description: "Manage your game projects, track analytics, and review performance.",
};

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session.isAuth || !session.userId) {
    return null;
  }

  const [user, stats] = await Promise.all([
    db.user.findUnique({ where: { id: session.userId } }),
    getDashboardStats(session.userId),
  ]);

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-glass-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Developer <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-foreground-muted text-sm mt-2">
            Welcome back, {user?.displayName || "Developer"}. Here is how your projects are performing.
          </p>
        </div>

        <Link href="/dashboard/upload" className="sm:self-start">
          <Button variant="primary" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Upload
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Recent Projects */}
        <div className="xl:col-span-2 space-y-6">
          <DashboardProjects />
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/upload">
                <Button variant="outline" size="sm" className="justify-start gap-3 w-full">
                  <PlusCircle className="w-4 h-4 text-accent-cyan" />
                  Upload new content
                </Button>
              </Link>
              <Link href={`/profile/${user?.username || ""}`}>
                <Button variant="outline" size="sm" className="justify-start gap-3 w-full">
                  <User className="w-4 h-4 text-primary" />
                  View public profile
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" size="sm" className="justify-start gap-3 w-full">
                  <BarChart3 className="w-4 h-4 text-accent-emerald" />
                  Detailed analytics report
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="justify-start gap-3 w-full">
                  <Settings className="w-4 h-4 text-foreground-muted" />
                  Edit profile settings
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
