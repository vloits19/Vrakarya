"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { analyze, logModeration } from "@/lib/moderation";

export async function toggleLike(postId: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return { error: "Unauthorized" };

  try {
    const existing = await db.like.findUnique({
      where: {
        authorId_postId: {
          authorId: session.userId,
          postId: postId,
        },
      },
    });

    if (existing) {
      await db.like.delete({
        where: { id: existing.id },
      });
    } else {
      await db.like.create({
        data: {
          authorId: session.userId,
          postId: postId,
        },
      });
    }

    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { error: "Failed to toggle like" };
  }
}

export async function toggleSave(postId: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return { error: "Unauthorized" };

  try {
    const existing = await db.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: session.userId,
          postId: postId,
        },
      },
    });

    if (existing) {
      await db.savedPost.delete({
        where: { id: existing.id },
      });
    } else {
      await db.savedPost.create({
        data: {
          userId: session.userId,
          postId: postId,
        },
      });
    }

    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    console.error("Error toggling save:", error);
    return { error: "Failed to toggle save" };
  }
}

export async function addComment(postId: string, content: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return { error: "Unauthorized" };

  if (!content.trim()) return { error: "Comment cannot be empty" };

  // --- Content Moderation ---
  const modResult = analyze(content);
  if (modResult.action === "block") {
    logModeration({
      userId: session.userId,
      source: "addComment",
      input: content,
      matches: modResult.matches,
      highestSeverity: modResult.highestSeverity,
      result: "blocked",
    });
    return { error: "Your comment contains prohibited content." };
  }
  const filteredContent = modResult.censored ?? content;
  if (modResult.censored) {
    logModeration({ userId: session.userId, source: "addComment", input: content, matches: modResult.matches, highestSeverity: modResult.highestSeverity, result: "censored" });
  }

  try {
    await db.comment.create({
      data: {
        content: filteredContent.trim(),
        authorId: session.userId,
        postId: postId,
      },
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}
