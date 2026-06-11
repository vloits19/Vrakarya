/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfileHeader } from "@/components/sections/ProfileHeader";
import { ProfileFeatured } from "@/components/sections/ProfileFeatured";
import { ProfileWorks } from "@/components/sections/ProfileWorks";
import { ProfileProjects } from "@/components/sections/ProfileProjects";
import { Card, Badge } from "@/components/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

import { db } from "@/config/database";
import { getFollowStats } from "@/app/actions/social";
import { verifySession } from "@/lib/auth";

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    return {
      title: "User Not Found — Vrakarya",
    };
  }

  return {
    title: `${user.displayName} (@${user.username}) — Vrakarya`,
    description: user.bio || `Check out ${user.displayName}'s profile on Vrakarya.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user: any = await db.user.findUnique({ where: { username } });

  if (!user) {
    notFound();
  }

  // Filter content by this developer
  const userProjects: any[] = [];
  const userPosts: any[] = [];

  const session = await verifySession();
  const isCurrentUser = session.userId === user.id;
  const { followers, following, isFollowing } = await getFollowStats(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/feed"
        className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Link>

      <div className="space-y-8">
        {/* Profile Header (Banner & Meta) */}
        <ProfileHeader
          user={user as any}
          projectCount={userProjects.length}
          followerCount={followers}
          followingCount={following}
          initialIsFollowing={isFollowing}
          isCurrentUser={isCurrentUser}
        />

        {/* Content Tabs Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            
            {/* Featured Project Highlight */}
            <ProfileFeatured projects={userProjects} />

            {/* Media Portfolio Grid */}
            <ProfileWorks posts={userPosts} />

            {/* All Projects List */}
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              All Projects
            </h2>
            <ProfileProjects />
            
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* About Card */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">About</h3>
              <p className="text-sm text-foreground-muted leading-relaxed mb-6">
                {user.bio || "No biography provided yet."}
              </p>
              <div className="space-y-3 border-t border-glass-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-dim">Role</span>
                  <span className="text-foreground font-semibold capitalize">{user.role}</span>
                </div>
                {user.location && (
                  <div className="flex justify-between">
                    <span className="text-foreground-dim">Location</span>
                    <span className="text-foreground font-semibold">{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex justify-between">
                    <span className="text-foreground-dim">Website</span>
                    <a href={user.website} target="_blank" rel="noreferrer" className="text-accent-cyan hover:underline font-semibold">
                      {user.website.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Skills Card */}
            {user.skills && user.skills.length > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent-cyan" />
                  Skills & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="bg-background-secondary/50 hover:bg-background-secondary transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Social Links Card */}
            {user.socialLinks && (
              <Card className="p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Social Links</h3>
                <div className="space-y-3">
                  {Object.entries(user.socialLinks).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-foreground-dim capitalize">{key}</span>
                        <a
                          href={value as string}
                          className="text-primary hover:underline font-medium"
                        >
                          Visit Page
                        </a>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
            
          </aside>
        </div>
      </div>
    </div>
  );
}
