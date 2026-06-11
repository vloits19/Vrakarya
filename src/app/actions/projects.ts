"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { analyze, logModeration } from "@/lib/moderation";

export async function createProject(formData: FormData) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) {
    return { error: "You must be logged in to create a project." };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!title) {
    return { error: "Project title is required." };
  }

  if (!description) {
    return { error: "Project description is required." };
  }

  // --- Content Moderation ---
  const titleMod = analyze(title);
  if (titleMod.action === "block") {
    logModeration({ userId: session.userId, source: "createProject.title", input: title, matches: titleMod.matches, highestSeverity: titleMod.highestSeverity, result: "blocked" });
    return { error: "Your project title contains prohibited content." };
  }
  const descMod = analyze(description);
  if (descMod.action === "block") {
    logModeration({ userId: session.userId, source: "createProject.description", input: description, matches: descMod.matches, highestSeverity: descMod.highestSeverity, result: "blocked" });
    return { error: "Your project description contains prohibited content." };
  }
  const filteredTitle = titleMod.censored ?? title;
  const filteredDesc = descMod.censored ?? description;
  if (titleMod.censored) {
    logModeration({ userId: session.userId, source: "createProject.title", input: title, matches: titleMod.matches, highestSeverity: titleMod.highestSeverity, result: "censored" });
  }
  if (descMod.censored) {
    logModeration({ userId: session.userId, source: "createProject.description", input: description, matches: descMod.matches, highestSeverity: descMod.highestSeverity, result: "censored" });
  }

  try {
    const project = await db.project.create({
      data: {
        title: filteredTitle,
        description: filteredDesc,
        authorId: session.userId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    revalidatePath("/feed");
    return { success: true, projectId: project.id };
  } catch (error) {
    console.error("Error creating project:", error);
    return { error: "Failed to create project. Please try again." };
  }
}

export async function getUserProjects(userId: string) {
  return db.project.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { discussions: true },
      },
    },
  });
}

export async function getDashboardStats(userId: string) {
  const [projectCount, postCount, followerCount, likeCount] =
    await Promise.all([
      db.project.count({ where: { authorId: userId } }),
      db.post.count({ where: { authorId: userId } }),
      db.follows.count({ where: { followingId: userId } }),
      db.like.count({
        where: { post: { authorId: userId } },
      }),
    ]);

  return {
    totalProjects: projectCount,
    totalPosts: postCount,
    totalFollowers: followerCount,
    totalLikes: likeCount,
    totalViews: 0, // Views not tracked in schema yet
    viewsTrend: 0,
    likesTrend: 0,
  };
}

export async function getPlatformStats() {
  const [userCount, projectCount, postCount] = await Promise.all([
    db.user.count(),
    db.project.count(),
    db.post.count(),
  ]);

  return { userCount, projectCount, postCount };
}
