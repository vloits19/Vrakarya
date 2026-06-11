import Link from "next/link";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { ExternalLink, Heart, Eye, MessageCircle, Share2, Tag, Layers, Calendar } from "lucide-react";
import { formatCount } from "@/lib/utils";
interface ProjectSidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: Record<string, any>;
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  return (
    <div className="space-y-6 sticky top-24">
      {/* Primary Actions Card */}
      <Card className="p-5 flex flex-col gap-3">
        <Button variant="primary" className="w-full justify-center">
          <Heart className="w-4 h-4 mr-2" />
          Add to Favorites ({formatCount(project.likeCount)})
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full justify-center text-xs">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {project.links?.website && (
            <Link href={project.links.website} target="_blank" className="w-full">
              <Button variant="outline" className="w-full justify-center text-xs">
                <ExternalLink className="w-4 h-4 mr-2" />
                Website
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Developer Card */}
      <Card className="p-5">
        <h3 className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-4">Developer</h3>
        <div className="flex items-center gap-3">
          <Link href={`/profile/${project.developer.username}`}>
            <Avatar
              fallback={project.developer.displayName}
              src={project.developer.avatarUrl}
              size="md"
            />
          </Link>
          <div>
            <Link
              href={`/profile/${project.developer.username}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
            >
              {project.developer.displayName}
            </Link>
            <span className="text-xs text-foreground-dim">
              @{project.developer.username}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats & Meta Card */}
      <Card className="p-5 space-y-5">
        <h3 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Project Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-foreground-dim">
              <Calendar className="w-4 h-4" /> Status
            </span>
            <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
              {project.status.replace("-", " ")}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-foreground-dim">
              <Eye className="w-4 h-4" /> Views
            </span>
            <span className="font-medium text-foreground">{formatCount(project.viewCount)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-foreground-dim">
              <MessageCircle className="w-4 h-4" /> Comments
            </span>
            <span className="font-medium text-foreground">{formatCount(project.commentCount)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-glass-border">
          <span className="flex items-center gap-2 text-sm text-foreground-dim mb-3">
            <Layers className="w-4 h-4" /> Tech Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech: string) => (
              <Badge key={tech} variant="default" className="bg-background-secondary/50">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-glass-border">
          <span className="flex items-center gap-2 text-sm text-foreground-dim mb-3">
            <Tag className="w-4 h-4" /> Categories
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.tags?.map((tag: { id: string; slug: string; name: string }) => (
              <Link key={tag.id} href={`/projects?tag=${tag.slug}`}>
                <Badge variant="outline" className="text-[10px] hover:border-accent-cyan hover:text-accent-cyan cursor-pointer transition-colors">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
