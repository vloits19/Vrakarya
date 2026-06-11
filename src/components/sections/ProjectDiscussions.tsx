"use client";

import { useState, useTransition } from "react";
import { Avatar, Button } from "@/components/ui";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { postDiscussion } from "@/app/actions/discussions";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface Discussion {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string | null;
    role: string;
  };
}

interface ProjectDiscussionsProps {
  projectId: string;
  initialDiscussions: Discussion[];
  currentUserId?: string;
}

export function ProjectDiscussions({ projectId, initialDiscussions, currentUserId }: ProjectDiscussionsProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    if (!currentUserId) {
      alert("Please log in to participate in the discussion.");
      return;
    }

    const currentContent = content.trim();
    setContent("");

    // Optimistic Add
    const tempId = `temp-${Date.now()}`;
    const newDiscussion: Discussion = {
      id: tempId,
      content: currentContent,
      createdAt: new Date(),
      author: {
        id: currentUserId,
        displayName: "You",
        username: "you",
        avatarUrl: null,
        role: "User"
      }
    };

    setDiscussions(prev => [newDiscussion, ...prev]);

    startTransition(async () => {
      const res = await postDiscussion(projectId, currentContent);
      if (res.error) {
        console.error(res.error);
        setDiscussions(prev => prev.filter(d => d.id !== tempId));
        alert(res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-foreground font-bold text-lg border-b border-glass-border pb-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3>Discussions ({discussions.length})</h3>
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar fallback="U" size="md" className="hidden sm:block" />
          <div className="flex-1 space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ask a question, give feedback, or discuss development progress..."
              className="w-full bg-background-secondary border border-glass-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={!content.trim() || isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-background-secondary/30 p-6 rounded-xl border border-glass-border text-center">
          <p className="text-sm text-foreground-muted mb-4">You must be logged in to participate in discussions.</p>
          <Link href="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        </div>
      )}

      <div className="space-y-6 mt-8">
        {discussions.length === 0 ? (
          <div className="text-center py-8 text-foreground-muted text-sm">
            No discussions yet. Be the first to start a conversation!
          </div>
        ) : (
          discussions.map(discussion => (
            <div key={discussion.id} className="flex gap-4">
              <Link href={`/profile/${discussion.author.username}`} className="flex-shrink-0">
                <Avatar fallback={discussion.author.displayName} src={discussion.author.avatarUrl || undefined} />
              </Link>
              <div className="flex-1 bg-background-secondary/20 p-4 rounded-xl border border-glass-border">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${discussion.author.username}`} className="font-semibold text-foreground text-sm hover:underline">
                      {discussion.author.displayName}
                    </Link>
                    {discussion.author.role === "Admin" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-foreground-muted">
                    {formatRelativeTime(new Date(discussion.createdAt).toISOString())}
                  </span>
                </div>
                <p className="text-sm text-foreground-muted whitespace-pre-wrap leading-relaxed">
                  {discussion.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
