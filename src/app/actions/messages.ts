"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { analyze, logModeration } from "@/lib/moderation";

export async function getConversations() {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return [];

  const userId = session.userId;

  const conversations = await db.conversation.findMany({
    where: {
      OR: [
        { userOneId: userId },
        { userTwoId: userId }
      ]
    },
    include: {
      userOne: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      userTwo: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return conversations.map(conv => {
    const otherUser = conv.userOneId === userId ? conv.userTwo : conv.userOne;
    const lastMessage = conv.messages[0];
    const unreadCount = 0; // We can improve this with an aggregate query if needed, but for MVP it's fine
    
    return {
      id: conv.id,
      otherUser,
      lastMessage,
      unreadCount
    };
  });
}

export async function getMessages(otherUserId: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return [];

  const userId = session.userId;

  const conversation = await db.conversation.findFirst({
    where: {
      OR: [
        { userOneId: userId, userTwoId: otherUserId },
        { userOneId: otherUserId, userTwoId: userId }
      ]
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } }
        }
      }
    }
  });

  return conversation?.messages || [];
}

export async function sendMessage(recipientId: string, content: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return { error: "Not authenticated" };

  const userId = session.userId;
  if (userId === recipientId) return { error: "Cannot message yourself" };

  // --- Content Moderation ---
  const modResult = analyze(content);
  if (modResult.action === "block") {
    logModeration({
      userId,
      source: "sendMessage",
      input: content,
      matches: modResult.matches,
      highestSeverity: modResult.highestSeverity,
      result: "blocked",
    });
    return { error: "Your message contains prohibited content and cannot be sent." };
  }
  let filteredContent = content;
  if (modResult.censored) {
    filteredContent = modResult.censored;
    logModeration({
      userId,
      source: "sendMessage",
      input: content,
      matches: modResult.matches,
      highestSeverity: modResult.highestSeverity,
      result: "censored",
    });
  }

  try {
    // Find or create conversation
    let conversation = await db.conversation.findFirst({
      where: {
        OR: [
          { userOneId: userId, userTwoId: recipientId },
          { userOneId: recipientId, userTwoId: userId }
        ]
      }
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userOneId: userId,
          userTwoId: recipientId
        }
      });
    }

    // Create message
    await db.message.create({
      data: {
        content: filteredContent,
        senderId: userId,
        conversationId: conversation.id
      }
    });

    // Update conversation updatedAt
    await db.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    revalidatePath(`/messages/${recipientId}`);
    revalidatePath(`/messages`);
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

export async function markAsRead(otherUserId: string) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return;

  const userId = session.userId;

  const conversation = await db.conversation.findFirst({
    where: {
      OR: [
        { userOneId: userId, userTwoId: otherUserId },
        { userOneId: otherUserId, userTwoId: userId }
      ]
    }
  });

  if (conversation) {
    await db.message.updateMany({
      where: {
        conversationId: conversation.id,
        senderId: otherUserId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
    revalidatePath(`/messages`);
    revalidatePath(`/messages/${otherUserId}`);
  }
}
