import { Card, Badge, Button } from "@/components/ui";
import { Project } from "@/types";
import { Heart, MessageCircle, ExternalLink, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { formatCount } from "@/lib/utils";

interface ProfileFeaturedProps {
  projects: Project[];
}

export function ProfileFeatured({ projects }: ProfileFeaturedProps) {
  if (!projects || projects.length === 0) return null;

  // Prefer an explicitly featured project, or just pick the first one
  const featured = projects.find(p => p.isFeatured) || projects[0];

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-accent-amber rounded-full animate-pulse" />
        Featured Project
      </h2>

      <Card hover padding="none" className="overflow-hidden group flex flex-col md:flex-row bg-background-secondary/50 border-glass-border hover:border-accent-amber/30 transition-all">
        {/* Cover Image */}
        <div className="w-full md:w-2/5 aspect-video md:aspect-auto bg-gradient-to-br from-background-tertiary to-primary/10 relative flex items-center justify-center overflow-hidden shrink-0">
          <Gamepad2 className="w-12 h-12 text-foreground-dim/20 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background-secondary/90 md:to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Link href={`/project/${featured.slug}`}>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-accent-amber transition-colors">
                  {featured.title}
                </h3>
              </Link>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                  {featured.status.replace("-", " ")}
                </Badge>
                {featured.tags.slice(0, 2).map(t => (
                  <Badge key={t.id} variant="outline" className="text-[10px]">{t.name}</Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3 mb-6">
            {featured.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-glass-border">
            <div className="flex items-center gap-4 text-xs text-foreground-dim">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" /> {formatCount(featured.likeCount)}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> {formatCount(featured.commentCount)}
              </span>
            </div>
            
            <Link href={`/project/${featured.slug}`}>
              <Button variant="primary" size="sm" className="bg-accent-amber hover:bg-accent-amber/90 text-black">
                View Project <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
