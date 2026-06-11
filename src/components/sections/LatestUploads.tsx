import Link from "next/link";
import { Card, Avatar } from "@/components/ui";
import { Clock, ArrowRight, Gamepad2 } from "lucide-react";
import { db } from "@/config/database";

export async function LatestUploads() {
  let latestProjects;
  try {
    latestProjects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
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
  } catch (err: any) {
    return <div className="p-8 text-red-500 font-mono text-sm max-w-4xl mx-auto break-words">LatestUploads Error: {String(err.message)}</div>;
  }

  if (latestProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent-cyan" />
              Latest <span className="text-foreground-muted font-normal">Uploads</span>
            </h2>
          </div>
          <Link href="/projects?sort=newest" className="group flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal scroll container on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
          {latestProjects.map((project) => (
            <Link 
              key={project.id} 
              href={`/project/${project.id}`}
              className="w-[85vw] sm:w-auto shrink-0 snap-start group"
            >
              <Card hover padding="none" className="h-full flex flex-col border-background-tertiary bg-background-secondary/30">
                <div className="relative h-40 bg-background-tertiary/50 flex items-center justify-center overflow-hidden rounded-t-[calc(var(--radius-lg)-1px)] group-hover:bg-background-tertiary transition-colors">
                  <Gamepad2 className="w-10 h-10 text-foreground-dim/20 group-hover:text-foreground-dim/40 transition-colors group-hover:scale-110 duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-secondary to-transparent opacity-80" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-accent-cyan transition-colors line-clamp-1 mb-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-auto pt-4">
                    <Avatar src={project.author.avatarUrl || undefined} fallback={project.author.displayName} size="xs" />
                    <span className="text-xs text-foreground-muted truncate">
                      {project.author.displayName}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
