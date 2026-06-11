import { Card, Badge } from "@/components/ui";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function RelatedProjects({}: { currentProject?: unknown }) {
  // In a real app, you would fetch projects based on the currentProject's tags/genrefer those with same developer or tags
  const related: { id: string, slug: string, status: string, title: string, shortDescription: string }[] = [];

  if (related.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent-cyan rounded-full" />
        More Like This
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((project) => (
          <Link key={project.id} href={`/project/${project.slug}`}>
            <Card hover padding="none" className="h-full flex flex-col bg-background-secondary/50 group">
              <div className="relative h-24 bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center overflow-hidden rounded-t-[calc(var(--radius-lg)-1px)]">
                <Gamepad2 className="w-8 h-8 text-foreground-dim/30 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2">
                  <Badge variant="primary" className="text-[9px]">
                    {project.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-accent-cyan transition-colors truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-foreground-muted line-clamp-2 mt-1">
                  {project.shortDescription}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
