"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { toggleFollow } from "@/app/actions/social";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  creatorId: string;
  initialIsFollowing: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ creatorId, initialIsFollowing, className, onFollowChange }: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const router = useRouter();

  const handleToggle = () => {
    // Optimistic update
    const newValue = !isFollowing;
    setIsFollowing(newValue);
    if (onFollowChange) onFollowChange(newValue);

    startTransition(async () => {
      const res = await toggleFollow(creatorId);
      if (res.error) {
        // Revert on error
        setIsFollowing(!newValue);
        if (onFollowChange) onFollowChange(!newValue);
        
        if (res.error === "Must be logged in to follow") {
          router.push("/login");
        } else {
          console.error(res.error);
        }
      }
    });
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "primary"}
      size="sm"
      className={className}
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4 mr-2 text-foreground-muted" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
