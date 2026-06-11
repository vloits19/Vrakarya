import Link from "next/link";
import { Card, Badge, Avatar } from "@/components/ui";
import { Gamepad2 } from "lucide-react";
import { db } from "@/config/database";

import { TiltCard } from "@/components/effects/TiltCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";

export async function FeaturedProjects() {
  const projects = await db.project.findMany({
    take: 6,
    orderBy: { createdAt: "desc" }, // No featured flag yet in schema, using latest
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          username: true,
        },
      },
    },
  });

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-foreground-muted max-w-lg">
                Discover amazing games being built by talented developers.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ScrollReveal key={project.id} direction="up" delay={0.2 + index * 0.1}>
              <TiltCard intensity={15} className="h-full">
                <Link
                  href={`/project/${project.id}`}
                  className="block h-full"
                >
                  <Card hover padding="none" className="h-full flex flex-col bg-background/60 backdrop-blur-md">
                    <div className="relative h-48 bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center overflow-hidden rounded-t-[calc(var(--radius-lg)-1px)] group-hover:scale-[1.02] transition-transform duration-500">
                      <Gamepad2 className="w-12 h-12 text-foreground-dim/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-transparent to-transparent opacity-80" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                          Latest
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-semibold text-foreground mb-1.5">
                        {project.title}
                      </h3>
                      <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar
                            fallback={project.author.displayName}
                            src={project.author.avatarUrl || undefined}
                            size="xs"
                          />
                          <span className="text-xs text-foreground-muted">
                            {project.author.displayName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
