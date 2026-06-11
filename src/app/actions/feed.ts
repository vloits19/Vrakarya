"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { analyze, logModeration } from "@/lib/moderation";

export async function getFeedPosts(page = 1, limit = 10, query = "") {
  const skip = (page - 1) * limit;

  const where = query
    ? {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      }
    : {};

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.post.count({ where }),
  ]);

  return {
    posts: posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      type: p.type,
      mediaUrl: p.mediaUrl,
      createdAt: p.createdAt.toISOString(),
      author: p.author,
      likeCount: p._count.likes,
      commentCount: p._count.comments,
    })),
    hasMore: skip + posts.length < total,
    total,
  };
}

export async function createPost(formData: FormData) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) {
    return { error: "You must be logged in to create a post." };
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("description") as string)?.trim() || "";
  const type = (formData.get("type") as string) || "image";
  const file = formData.get("file") as File | null;

  if (!title) {
    return { error: "Post title is required." };
  }

  // --- Content Moderation ---
  const titleMod = analyze(title);
  if (titleMod.action === "block") {
    logModeration({
      userId: session.userId,
      source: "createPost.title",
      input: title,
      matches: titleMod.matches,
      highestSeverity: titleMod.highestSeverity,
      result: "blocked",
    });
    return { error: "Your post title contains prohibited content." };
  }

  const contentMod = analyze(content);
  if (contentMod.action === "block") {
    logModeration({
      userId: session.userId,
      source: "createPost.content",
      input: content,
      matches: contentMod.matches,
      highestSeverity: contentMod.highestSeverity,
      result: "blocked",
    });
    return { error: "Your post content contains prohibited content." };
  }

  const filteredTitle = titleMod.censored ?? title;
  const filteredContent = contentMod.censored ?? content;

  if (titleMod.censored) {
    logModeration({ userId: session.userId, source: "createPost.title", input: title, matches: titleMod.matches, highestSeverity: titleMod.highestSeverity, result: "censored" });
  }
  if (contentMod.censored) {
    logModeration({ userId: session.userId, source: "createPost.content", input: content, matches: contentMod.matches, highestSeverity: contentMod.highestSeverity, result: "censored" });
  }

  let mediaUrl = null;

  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      
      await writeFile(filePath, buffer);
      mediaUrl = `/uploads/${fileName}`;
    } catch (err) {
      console.error("File upload error", err);
      return { error: "Failed to upload file." };
    }
  }

  try {
    const post = await db.post.create({
      data: {
        title: filteredTitle,
        content: filteredContent,
        type,
        mediaUrl,
        authorId: session.userId,
      },
    });

    revalidatePath("/feed");
    revalidatePath("/dashboard");
    return { success: true, postId: post.id };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post. Please try again." };
  }
}
