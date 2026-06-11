import { Button, Avatar, Card } from "@/components/ui";
import { Users } from "lucide-react";
import Link from "next/link";
import { db } from "@/config/database";

export const metadata = {
  title: "Developers — Vrakarya",
  description: "Discover and connect with game creators from around the world.",
};

export default async function DevelopersPage() {
  const developers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          projects: true,
          followers: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Developer <span className="gradient-text">Directory</span>
          </h1>
          <p className="text-foreground-muted text-sm mt-1">
            Discover and connect with game creators from around the world.
          </p>
        </div>
      </div>

      {developers.length === 0 ? (
        <div className="py-24 text-center glass-card p-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-4 tracking-tight">No developers have joined yet.</h3>
          <p className="text-foreground-muted mb-8 max-w-lg mx-auto text-lg">
            The community is just getting started. Be the first creator to join the platform, showcase your work, and set the standard.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg">Register Now</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <Link key={dev.id} href={`/profile/${dev.username}`} className="group">
              <Card hover className="p-6 h-full flex flex-col items-center text-center">
                <Avatar
                  fallback={dev.displayName}
                  src={dev.avatarUrl || undefined}
                  size="lg"
                  className="mb-4 ring-2 ring-glass-border group-hover:ring-primary/50 transition-all"
                />
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {dev.displayName}
                </h3>
                <p className="text-xs text-foreground-muted mb-3">@{dev.username}</p>
                {dev.bio && (
                  <p className="text-sm text-foreground-muted line-clamp-2 mb-4 leading-relaxed">
                    {dev.bio}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-4 text-xs text-foreground-dim pt-4 border-t border-glass-border w-full justify-center">
                  <span><strong className="text-foreground">{dev._count.projects}</strong> projects</span>
                  <span><strong className="text-foreground">{dev._count.followers}</strong> followers</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
