"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFollow(creatorId: string) {
  try {
    const session = await verifySession();
    if (!session.isAuth || !session.userId) {
      return { error: "Must be logged in to follow" };
    }

    if (session.userId === creatorId) {
      return { error: "Cannot follow yourself" };
    }

    // Check if already following
    const existingFollow = await db.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.userId,
          followingId: creatorId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await db.follows.delete({
        where: {
          followerId_followingId: {
            followerId: session.userId,
            followingId: creatorId,
          },
        },
      });
    } else {
      // Follow
      await db.follows.create({
        data: {
          followerId: session.userId,
          followingId: creatorId,
        },
      });
    }

    revalidatePath(`/profile/[username]`, 'page');
    revalidatePath(`/dashboard/analytics`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { error: "Failed to process follow action" };
  }
}

export async function getFollowStats(userId: string) {
  try {
    const [followers, following] = await Promise.all([
      db.follows.count({ where: { followingId: userId } }),
      db.follows.count({ where: { followerId: userId } }),
    ]);

    let isFollowing = false;
    const session = await verifySession();
    
    if (session.isAuth && session.userId) {
      const followRecord = await db.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.userId,
            followingId: userId,
          },
        },
      });
      isFollowing = !!followRecord;
    }

    return { followers, following, isFollowing };
  } catch (error) {
    console.error("Error getting follow stats:", error);
    return { followers: 0, following: 0, isFollowing: false };
  }
}
