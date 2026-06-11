import Link from "next/link";
import { Card, Button } from "@/components/ui";
import { ExternalLink, Gamepad2, FolderX, Calendar } from "lucide-react";
import { verifySession } from "@/lib/auth";
import { getUserProjects } from "@/app/actions/projects";

export async function DashboardProjects() {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return null;

  const projects = await getUserProjects(session.userId);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
        {projects.length > 0 && (
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center mb-4">
            <FolderX className="w-6 h-6 text-foreground-muted" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No projects yet</h3>
          <p className="text-sm text-foreground-muted mb-4 max-w-sm">
            You haven&apos;t uploaded any games or projects. Get started by creating your first showcase.
          </p>
          <Link href="/dashboard/upload">
            <Button variant="outline" size="sm">Create Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.slice(0, 5).map((project) => (
            <Card key={project.id} padding="none" className="flex items-center gap-4 p-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-6 h-6 text-foreground-dim/30" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-foreground-muted truncate">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-foreground-dim">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Link */}
              <Link
                href={`/project/${project.id}`}
                className="p-2 rounded-lg text-foreground-dim hover:text-foreground hover:bg-background-tertiary transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
