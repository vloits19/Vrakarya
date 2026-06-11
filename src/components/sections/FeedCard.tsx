"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { Card, Avatar, Badge, Button } from "@/components/ui";
import { Heart, MessageCircle, Play, Box, Loader2, Share2, Bookmark } from "lucide-react";
import { formatRelativeTime, formatCount } from "@/lib/utils";
import type { Post } from "@/types";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { toggleLike, toggleSave, addComment } from "@/app/actions/interactions";

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer').then(m => m.ModelViewer), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-background-tertiary flex flex-col items-center justify-center border border-glass-border">
      <Loader2 className="w-8 h-8 animate-spin text-accent-cyan mb-2" />
      <span className="text-sm text-foreground-muted font-medium">Loading 3D Engine...</span>
    </div>
  )
});

interface FeedCardProps {
  post: Post;
}

export function FeedCard({ post }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const handleLike = async () => {
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    await toggleLike(post.id);
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    await toggleSave(post.id);
  };

  const handlePostComment = async () => {
    if (!commentInput.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    const result = await addComment(post.id, commentInput);
    if (result?.success) {
      setCommentInput("");
    }
    setIsSubmittingComment(false);
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) {
      if (post.imageUrl) {
        return (
          <div className="relative w-full rounded-lg overflow-hidden mt-4 bg-background-tertiary border border-glass-border">
            <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        );
      }
      return null;
    }

    const item = post.media[0]; // For now, handle single media item display

    switch (item.type) {
      case "video":
        return (
          <div className="relative w-full rounded-lg overflow-hidden mt-4 bg-black border border-glass-border">
            <video 
              src={item.previewUrl} 
              controls 
              className="w-full max-h-[500px] object-contain"
              poster={item.thumbnailUrl}
            />
          </div>
        );
      case "image":
        return (
          <div className="relative w-full rounded-lg overflow-hidden mt-4 bg-background-tertiary border border-glass-border">
            <img src={item.previewUrl} alt={item.name} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        );
      case "model":
        if (isModelLoaded) {
          return (
            <div className="mt-4">
              <ModelViewer url={item.previewUrl} />
            </div>
          );
        }
        return (
          <div 
            onClick={() => setIsModelLoaded(true)}
            className="relative w-full rounded-lg overflow-hidden mt-4 bg-background-tertiary border border-glass-border h-64 flex flex-col items-center justify-center group cursor-pointer hover:bg-background-secondary transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-primary/10 opacity-50 group-hover:opacity-70 transition-opacity" />
            <Box className="w-12 h-12 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-foreground z-10 group-hover:text-accent-cyan transition-colors">Click to Load 3D Model</span>
            <span className="text-xs text-foreground-muted z-10 mt-1">{item.name} • {(item.size / 1024 / 1024).toFixed(1)} MB</span>
            <div className="absolute top-3 right-3 p-1.5 rounded bg-black/40 backdrop-blur-sm group-hover:bg-accent-cyan/20 transition-colors">
              <Box className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="relative w-full rounded-lg mt-4 bg-background-tertiary border border-glass-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 text-primary ml-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
              <div className="h-1.5 w-full bg-background mt-2 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary rounded-full" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollReveal delay={0.1}>
      <Card hover padding="none" className="overflow-hidden bg-background/50 backdrop-blur-sm">
        <div className="p-5">
          {/* Author Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar
                  fallback={post.author.displayName}
                  src={post.author.avatarUrl}
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
                  {post.project && (
                    <>
                      <span className="mx-1.5">·</span>
                      <Link
                        href={`/project/${post.project.slug}`}
                        className="text-accent-cyan hover:underline font-medium"
                      >
                        {post.project.title}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground mb-2">
            {post.title}
          </h3>

          {/* Content */}
          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3 mb-4 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-[10px] hover:border-accent-cyan transition-colors cursor-pointer">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Media Payload */}
          {renderMedia()}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-glass-border">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${isLiked ? 'text-accent-rose' : 'text-foreground-dim hover:text-foreground'}`}
              >
                <Heart className={`w-4.5 h-4.5 transition-transform ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} aria-hidden="true" />
                <span>{formatCount(likeCount)}</span>
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                aria-label={showComments ? "Hide comments" : "Show comments"}
                aria-expanded={showComments}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${showComments ? 'text-accent-cyan' : 'text-foreground-dim hover:text-foreground'}`}
              >
                <MessageCircle className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span>{formatCount(post.commentCount)}</span>
              </button>
              <button 
                aria-label="Share post"
                className="flex items-center gap-1.5 text-xs font-medium text-foreground-dim hover:text-foreground transition-colors group hidden sm:flex"
              >
                <Share2 className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span>Share</span>
              </button>
            </div>
            <button 
              onClick={handleSave}
              aria-label={isSaved ? "Remove from bookmarks" : "Save to bookmarks"}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${isSaved ? 'text-accent-amber' : 'text-foreground-dim hover:text-foreground'}`}
            >
              <Bookmark className={`w-4.5 h-4.5 transition-transform ${isSaved ? 'fill-current scale-110' : 'group-hover:scale-110'}`} aria-hidden="true" />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-glass-border animate-fade-in-up">
              <div className="flex gap-3 mb-4">
                <Avatar fallback="Me" size="sm" />
                <div className="flex-1 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                    className="flex-1 bg-background-secondary border border-border rounded-full px-4 text-sm focus:outline-none focus:border-accent-cyan"
                  />
                  <Button size="sm" className="rounded-full px-4" onClick={handlePostComment} disabled={isSubmittingComment}>
                    {isSubmittingComment ? "..." : "Post"}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-foreground-muted text-center py-4">No comments yet. Be the first to start the discussion!</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ScrollReveal>
  );
}
