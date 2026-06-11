import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { Eye, Heart, Gamepad2 } from "lucide-react";
import { formatCount } from "@/lib/utils";

export function ProfileProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {([] as {id: string, slug: string, title: string, shortDescription: string, tags: {id: string, name: string}[], viewCount: number, likeCount: number}[]).map((project) => (
        <Link key={project.id} href={`/project/${project.slug}`}>
          <Card hover padding="none" className="h-full flex flex-col">
            {/* Cover */}
            <div className="relative h-36 bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center rounded-t-[calc(var(--radius-lg)-1px)]">
              <Gamepad2 className="w-10 h-10 text-foreground-dim/30" />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-foreground-muted line-clamp-2 mb-3">
                {project.shortDescription}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-[10px]">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-3 text-foreground-dim text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatCount(project.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatCount(project.likeCount)}
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
