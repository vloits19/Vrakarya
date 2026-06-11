"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Avatar, Input, Button } from "@/components/ui";
import { Send, Loader2 } from "lucide-react";
import { sendMessage, markAsRead } from "@/app/actions/messages";
import { formatRelativeTime } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

interface ChatWindowProps {
  currentUserId: string;
  recipientUser: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  initialMessages: Message[];
}

export function ChatWindow({ currentUserId, recipientUser, initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Mark as read when entering the chat
    markAsRead(recipientUser.id);
  }, [messages, recipientUser.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const content = input.trim();
    setInput("");

    // Optimistic UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUserId,
      createdAt: new Date(),
      sender: {
        id: currentUserId,
        displayName: "You",
        avatarUrl: null
      }
    };

    setMessages(prev => [...prev, optimisticMessage]);

    startTransition(async () => {
      const res = await sendMessage(recipientUser.id, content);
      if (res.error) {
        console.error(res.error);
        // Rollback on error
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-glass-border flex items-center gap-3 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <Avatar fallback={recipientUser.displayName} src={recipientUser.avatarUrl || undefined} />
        <div>
          <h2 className="font-bold text-foreground">{recipientUser.displayName}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-8 flex-shrink-0">
                  {showAvatar && (
                    <Avatar fallback={msg.sender.displayName} src={msg.sender.avatarUrl || undefined} size="sm" />
                  )}
                </div>
              )}
              
              <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`px-4 py-2.5 rounded-2xl ${
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-background-tertiary text-foreground rounded-bl-sm"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[10px] text-foreground-muted mt-1 px-1">
                  {formatRelativeTime(new Date(msg.createdAt).toISOString())}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-glass-border bg-background/50">
        <form onSubmit={handleSend} className="flex items-center gap-2 relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message @${recipientUser.displayName}...`}
            className="w-full bg-background-secondary border-glass-border pr-12 rounded-full"
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="sm" 
            className="absolute right-1 w-8 h-8 p-0 rounded-full flex items-center justify-center"
            disabled={!input.trim() || isPending}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
