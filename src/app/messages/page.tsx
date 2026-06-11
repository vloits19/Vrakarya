import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-foreground-muted bg-background/50">
      <div className="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mb-4 border border-glass-border">
        <MessageSquare className="w-8 h-8 text-foreground-dim" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Your Messages</h3>
      <p className="text-sm">Select a conversation from the sidebar or start a new one.</p>
    </div>
  );
}
