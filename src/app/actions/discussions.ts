"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { analyze, logModeration } from "@/lib/moderation";

export async function getDiscussions(projectId: string) {
  const discussions = await db.projectDiscussion.findMany({
    where: { projectId },
    include: {
      author: {
        select: { id: true, displayName: true, username: true, avatarUrl: true, role: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return discussions;
}

export async function postDiscussion(projectId: string, content: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) {
    return { error: "Must be logged in to participate in discussions." };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty." };
  }

  // --- Content Moderation ---
  const modResult = analyze(content);
  if (modResult.action === "block") {
    logModeration({
      userId: session.userId,
      source: "postDiscussion",
      input: content,
      matches: modResult.matches,
      highestSeverity: modResult.highestSeverity,
      result: "blocked",
    });
    return { error: "Your comment contains prohibited content." };
  }
  const filteredContent = modResult.censored ?? content;
  if (modResult.censored) {
    logModeration({ userId: session.userId, source: "postDiscussion", input: content, matches: modResult.matches, highestSeverity: modResult.highestSeverity, result: "censored" });
  }

  try {
    const discussion = await db.projectDiscussion.create({
      data: {
        content: filteredContent.trim(),
        authorId: session.userId,
        projectId
      }
    });

    revalidatePath(`/project/[slug]`, 'page');
    return { success: true, discussion };
  } catch (error) {
    console.error("Error posting discussion:", error);
    return { error: "Failed to post discussion comment." };
  }
}
