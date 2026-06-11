import { Avatar, Badge, Button } from "@/components/ui";
import { ExternalLink, Heart, Eye, MessageCircle, Gamepad2 } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: Record<string, any>;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-background-tertiary via-primary/5 to-background-secondary flex items-center justify-center overflow-hidden rounded-xl">
        <Gamepad2 className="w-20 h-20 text-foreground-dim/20 animate-float" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Info */}
      <div className="relative -mt-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          {/* Developer Avatar */}
          <div className="flex items-center gap-3">
            <Avatar
              fallback={project.developer.displayName}
              src={project.developer.avatarUrl}
              size="lg"
              className="ring-4 ring-background"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {project.title}
              </h1>
              <p className="text-sm text-foreground-muted">
                by{" "}
                <span className="text-accent-cyan hover:underline cursor-pointer">
                  {project.developer.displayName}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="sm:ml-auto flex items-center gap-3">
            <Button variant="primary" size="sm">
              <Heart className="w-4 h-4" />
              Like
            </Button>
            {project.links?.website && (
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
                Visit
              </Button>
            )}
          </div>
        </div>

        {/* Status & Stats */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge variant="primary">
            {project.status?.replace("-", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </Badge>

          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {formatCount(project.viewCount)} views
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              {formatCount(project.likeCount)} likes
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              {formatCount(project.commentCount)} comments
            </span>
          </div>
        </div>

        {/* Tags & Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags?.map((tag: { id: string; name: string }) => (
            <Badge key={tag.id} variant="cyan">
              {tag.name}
            </Badge>
          ))}
          {project.techStack?.map((tech: string) => (
            <Badge key={tech} variant="default">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-foreground-muted leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </div>
    </div>
  );
}
