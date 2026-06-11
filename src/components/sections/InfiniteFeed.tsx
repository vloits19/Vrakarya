"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { getFeedPosts } from "@/app/actions/feed";
import { Avatar } from "@/components/ui";
import { Card } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

const POSTS_PER_PAGE = 10;

interface FeedPost {
  id: string;
  title: string;
  content: string;
  type: string;
  mediaUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
}

export function InfiniteFeed() {
  const router = useRouter();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPosts = useCallback(
    async (currentPage: number, query: string, append = false) => {
      setIsLoading(true);
      try {
        const result = await getFeedPosts(currentPage, POSTS_PER_PAGE, query);
        setPosts((prev) =>
          append ? [...prev, ...result.posts] : result.posts
        );
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts(1, searchQuery, false);
  }, [loadPosts, searchQuery]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((p) => {
            const nextPage = p + 1;
            loadPosts(nextPage, searchQuery, true);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, searchQuery, loadPosts]);

  const handleSearch = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search posts..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
          />
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {posts.length === 0 && !isLoading && (
          <div className="text-center py-20 glass-card p-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No devlogs yet.</h3>
            <p className="text-foreground-muted mb-6">
              Be the first to share your progress and inspire others.
            </p>
            <button
              onClick={() => router.push("/dashboard/upload")}
              className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Post
            </button>
          </div>
        )}

        {posts.map((post) => (
          <Card key={post.id} hover padding="none" className="overflow-hidden bg-background/50 backdrop-blur-sm">
            <div className="p-5">
              {/* Author Row */}
              <div className="flex items-start gap-3 mb-4">
                <Link href={`/profile/${post.author.username}`}>
                  <Avatar
                    fallback={post.author.displayName}
                    src={post.author.avatarUrl || undefined}
                    size="md"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
                    >
                      {post.author.displayName}
                    </Link>
                    <span className="text-xs text-foreground-dim hidden sm:inline">
                      @{post.author.username}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-dim">
                    {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-foreground mb-2">
                {post.title}
              </h3>

              {/* Content */}
              <p className="text-sm text-foreground-muted leading-relaxed line-clamp-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Media */}
              {post.mediaUrl && (
                <div className="relative w-full rounded-lg overflow-hidden mt-4 bg-background-tertiary border border-glass-border">
                  {post.type === "video" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      className="w-full max-h-[500px] object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4 mt-4 border-t border-glass-border text-foreground-dim text-xs">
                <span>{post.likeCount} likes</span>
                <span>{post.commentCount} comments</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading / Observer */}
      <div ref={observerTarget} className="py-8 flex justify-center">
        {isLoading && (
          <Loader2 className="w-6 h-6 text-accent-cyan animate-spin" />
        )}
        {!hasMore && posts.length > 0 && !isLoading && (
          <span className="text-sm text-foreground-muted">
            You&apos;ve caught up on all recent posts!
          </span>
        )}
      </div>
    </div>
  );
}
