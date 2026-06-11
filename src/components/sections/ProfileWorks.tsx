/* eslint-disable @next/next/no-img-element */
import { Post } from "@/types";
import { Play, Box, FileAudio } from "lucide-react";
import Link from "next/link";

interface ProfileWorksProps {
  posts: Post[];
}

export function ProfileWorks({ posts }: ProfileWorksProps) {
  // Filter for posts that have rich media attached
  const mediaPosts = posts.filter(post => post.media && post.media.length > 0);

  if (mediaPosts.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-accent-cyan rounded-full" />
        Portfolio & Works
      </h2>

      {/* Masonry-style Grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {mediaPosts.map(post => {
          const item = post.media![0];
          
          return (
            <Link key={post.id} href={`/post/${post.id}`} className="block break-inside-avoid group">
              <div className="relative rounded-lg overflow-hidden bg-background-tertiary border border-glass-border">
                {/* Media Preview rendering */}
                {item.type === "image" && (
                  <img src={item.previewUrl} alt={item.name} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                )}
                {item.type === "video" && (
                  <div className="relative aspect-[4/5] bg-black">
                    <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                {item.type === "model" && (
                  <div className="relative aspect-square bg-gradient-to-br from-background-tertiary to-background flex items-center justify-center">
                    <Box className="w-10 h-10 text-accent-cyan/50 group-hover:scale-110 transition-transform" />
                  </div>
                )}
                {item.type === "audio" && (
                  <div className="relative aspect-video bg-gradient-to-br from-background-tertiary to-background flex items-center justify-center">
                    <FileAudio className="w-10 h-10 text-primary/50 group-hover:scale-110 transition-transform" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h4 className="text-sm font-semibold text-white truncate">{post.title}</h4>
                  <div className="flex gap-1 mt-1">
                    {post.tags.slice(0, 2).map(t => (
                      <span key={t.id} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/20 text-white font-medium">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
