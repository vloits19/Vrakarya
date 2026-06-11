import { Card } from "@/components/ui";
import { Eye, Heart, Folder, Users, TrendingUp, TrendingDown } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const items = [
    {
      label: "Total Views",
      value: formatCount(stats.totalViews),
      trend: stats.viewsTrend,
      icon: Eye,
      color: "text-accent-cyan",
      bgColor: "bg-accent-cyan/10",
    },
    {
      label: "Total Likes",
      value: formatCount(stats.totalLikes),
      trend: stats.likesTrend,
      icon: Heart,
      color: "text-accent-rose",
      bgColor: "bg-accent-rose/10",
    },
    {
      label: "Projects",
      value: stats.totalProjects.toString(),
      icon: Folder,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Followers",
      value: formatCount(stats.totalFollowers),
      icon: Users,
      color: "text-accent-emerald",
      bgColor: "bg-accent-emerald/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} padding="md" className="relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            {item.trend !== undefined && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  item.trend >= 0 ? "text-accent-emerald" : "text-accent-rose"
                }`}
              >
                {item.trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(item.trend)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
          <p className="text-xs text-foreground-muted mt-0.5">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
