import { getConversations } from "@/app/actions/messages";
import { Avatar } from "@/components/ui";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = {
  title: "Messages — Vrakarya",
};

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const conversations = await getConversations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex h-[calc(100vh-10rem)] bg-background-secondary/30 rounded-xl border border-glass-border overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <div className="w-80 border-r border-glass-border flex flex-col bg-background/50 hidden md:flex">
          <div className="p-4 border-b border-glass-border">
            <h2 className="text-lg font-bold text-foreground">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-foreground-muted text-sm">
                No conversations yet.
              </div>
            ) : (
              conversations.map(conv => (
                <Link 
                  key={conv.id} 
                  href={`/messages/${conv.otherUser.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-background-tertiary transition-colors border-b border-glass-border/50"
                >
                  <Avatar fallback={conv.otherUser.displayName} src={conv.otherUser.avatarUrl || undefined} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-foreground text-sm truncate">{conv.otherUser.displayName}</span>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-foreground-muted flex-shrink-0">
                          {formatRelativeTime(conv.lastMessage.createdAt.toISOString())}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-foreground-muted truncate">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background-secondary/10 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
