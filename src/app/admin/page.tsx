import { Card } from "@/components/ui";
import { Users, FileImage, FolderOpen, Activity } from "lucide-react";
import { getPlatformStats } from "@/app/actions/projects";

export const metadata = {
  title: "Admin Overview — Vrakarya",
};

export default async function AdminOverviewPage() {
  const { userCount, projectCount, postCount } = await getPlatformStats();

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
    { label: "Total Projects", value: projectCount, icon: FolderOpen, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Feed Posts", value: postCount, icon: FileImage, color: "text-accent-emerald", bg: "bg-accent-emerald/10" },
    { label: "Platform Status", value: "Healthy", icon: Activity, color: "text-accent-rose", bg: "bg-accent-rose/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Platform Overview</h2>
        <p className="text-sm text-foreground-muted">Top-level metrics and system status.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground-dim uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 mt-8">
        <h3 className="text-base font-bold text-foreground mb-4">Recent System Activity</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-lg bg-background-secondary/50">
          <Activity className="w-8 h-8 text-foreground-muted mb-3" />
          <p className="text-sm text-foreground-muted">No recent system activity to display.</p>
        </div>
      </Card>
    </div>
  );
}
