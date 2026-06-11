import { InfiniteFeed } from "@/components/sections/InfiniteFeed";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Feed — Vrakarya",
  description: "See what the game developer community is building and posting.",
};

export default function FeedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Community <span className="gradient-text">Feed</span>
            </h1>
            <p className="text-foreground-muted text-sm mt-1">
              Stay updated with the latest progress updates and design drops from other developers.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-accent-cyan" /></div>}>
          <InfiniteFeed />
        </Suspense>
      </div>
    </div>
  );
}
