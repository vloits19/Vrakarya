import { Avatar, Button } from "@/components/ui";
import { FollowButton } from "@/components/ui/FollowButton";
import { MapPin, LinkIcon, Calendar, Users, Folder } from "lucide-react";
import Link from "next/link";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user: User;
  projectCount?: number;
  followerCount?: number;
  followingCount?: number;
  initialIsFollowing?: boolean;
  isCurrentUser?: boolean;
}

export function ProfileHeader({
  user,
  projectCount = 3,
  followerCount = 0,
  followingCount = 0,
  initialIsFollowing = false,
  isCurrentUser = false,
}: ProfileHeaderProps) {
  return (
    <div>
      {/* Banner */}
      <div 
        className="h-32 sm:h-56 bg-gradient-to-r from-accent-cyan/20 via-primary/20 to-accent-cyan/20 rounded-xl bg-cover bg-center"
        style={user.bannerUrl ? { backgroundImage: `url(${user.bannerUrl})` } : {}}
      />

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 -mt-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar
            fallback={user.displayName}
            src={user.avatarUrl}
            size="xl"
            className="ring-4 ring-background"
          />

          <div className="flex-1 pt-2 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user.displayName}
                </h1>
                <p className="text-sm text-foreground-muted">
                  @{user.username}
                </p>
              </div>

              <div className="sm:ml-auto flex gap-2">
                {!isCurrentUser && (
                  <>
                    <FollowButton 
                      creatorId={user.id} 
                      initialIsFollowing={initialIsFollowing} 
                    />
                    <Link href={`/messages/${user.id}`}>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-foreground-muted max-w-xl leading-relaxed mb-3">
                {user.bio}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-foreground-dim mb-4">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  <a href={user.website} className="text-accent-cyan hover:underline">
                    {user.website.replace("https://", "")}
                  </a>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-sm">
                <Folder className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{projectCount}</span>
                <span className="text-foreground-muted">Projects</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4 text-accent-cyan" />
                <span className="font-semibold text-foreground">{followerCount}</span>
                <span className="text-foreground-muted">Followers</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-foreground">{followingCount}</span>
                <span className="text-foreground-muted ml-1.5">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 border-b border-glass-border">
        <div className="flex gap-1 px-4 sm:px-6">
          {["Projects", "Activity", "About"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                i === 0
                  ? "text-foreground border-primary"
                  : "text-foreground-muted border-transparent hover:text-foreground hover:border-glass-border-hover"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
