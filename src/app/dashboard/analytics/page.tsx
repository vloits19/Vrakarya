import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { BarChart3, FolderOpen, Image as ImageIcon, MessageSquare, Heart } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { db } from "@/config/database";

export const metadata = {
  title: "Analytics — Dashboard",
};

export default async function AnalyticsPage() {
  const session = await verifySession();
  
  if (!session.isAuth || !session.userId) {
    redirect("/login");
  }

  // Fetch real data
  const [projectCount, postCount, likeCount, commentCount, userPosts, topPosts] = await Promise.all([
    db.project.count({ where: { authorId: session.userId } }),
    db.post.count({ where: { authorId: session.userId } }),
    db.like.count({ where: { post: { authorId: session.userId } } }),
    db.comment.count({ where: { post: { authorId: session.userId } } }),
    db.post.findMany({
      where: { authorId: session.userId },
      select: { createdAt: true },
    }),
    db.post.findMany({
      where: { authorId: session.userId },
      include: {
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { likes: { _count: 'desc' } },
      take: 3
    })
  ]);

  const stats = [
    { label: "Total Projects", value: projectCount, icon: FolderOpen, color: "text-accent-cyan" },
    { label: "Total Posts", value: postCount, icon: ImageIcon, color: "text-primary" },
    { label: "Likes Received", value: likeCount, icon: Heart, color: "text-accent-rose" },
    { label: "Comments Received", value: commentCount, icon: MessageSquare, color: "text-accent-emerald" },
  ];

  // Calculate real chart data for the last 14 days based on post creation
  const now = new Date();
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (13 - i));
    d.setHours(0,0,0,0);
    return d;
  });

  const chartRawCounts = last14Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return userPosts.filter(p => p.createdAt >= date && p.createdAt < nextDay).length;
  });

  const maxCount = Math.max(...chartRawCounts, 1);
  const chartData = chartRawCounts.map(c => ({ count: c, height: (c / maxCount) * 100 }));

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
      <div className="pb-6 border-b border-glass-border">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Analytics Overview
        </h1>
        <p className="text-sm text-foreground-muted mt-2">
          Track your performance, engagement, and audience growth.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-5 flex flex-col justify-between bg-background-secondary/10 backdrop-blur-sm border-glass-border shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-background-tertiary ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {typeof stat.value === "number" ? formatCount(stat.value) : stat.value}
                </h3>
                <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6 bg-background-secondary/10 backdrop-blur-sm border-glass-border shadow-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-foreground">Posting Activity</h2>
              <p className="text-xs text-foreground-muted">Number of posts created over the last 14 days.</p>
            </div>
            <select className="bg-background-tertiary border border-border text-xs rounded-md px-3 py-1.5 outline-none focus:border-primary">
              <option>Last 14 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.map((data, i) => (
              <div key={i} className="relative w-full group h-full flex items-end">
                <div 
                  className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative"
                  style={{ height: `${data.height}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {data.count} posts
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-foreground-muted uppercase font-medium">
            <span>2 Weeks Ago</span>
            <span>Today</span>
          </div>
        </Card>

        <Card className="p-6 bg-background-secondary/10 backdrop-blur-sm border-glass-border shadow-md">
          <h2 className="text-lg font-bold text-foreground mb-6">Top Performing Posts</h2>
          <div className="space-y-6">
            {topPosts.length === 0 ? (
              <p className="text-sm text-foreground-muted">No posts found.</p>
            ) : (
              topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center font-bold text-foreground-muted border border-glass-border shrink-0">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{post.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-foreground-dim">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-accent-rose/70" /> {formatCount(post._count.likes)}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-accent-cyan/70" /> {formatCount(post._count.comments)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
