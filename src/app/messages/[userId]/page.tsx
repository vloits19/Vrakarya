import { getMessages } from "@/app/actions/messages";
import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ChatWindow } from "@/components/sections/ChatWindow";

interface ChatPageProps {
  params: Promise<{ userId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId: otherUserId } = await params;
  
  const session = await verifySession();
  if (!session.isAuth || !session.userId) {
    redirect("/login");
  }

  if (session.userId === otherUserId) {
    redirect("/messages");
  }

  const recipient = await db.user.findUnique({
    where: { id: otherUserId },
    select: { id: true, displayName: true, avatarUrl: true }
  });

  if (!recipient) {
    notFound();
  }

  const messages = await getMessages(otherUserId);

  return (
    <ChatWindow 
      currentUserId={session.userId} 
      recipientUser={recipient} 
      initialMessages={messages} 
    />
  );
}
