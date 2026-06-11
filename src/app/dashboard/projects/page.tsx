import { verifySession } from "@/lib/auth";
import { db } from "@/config/database";
import { redirect } from "next/navigation";
import { Card, Badge, Button } from "@/components/ui";
import { ExternalLink, Gamepad2, FolderX, Plus, Calendar, Settings } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Projects — Dashboard",
};

export default async function ProjectsPage() {
  const session = await verifySession();
  
  if (!session.isAuth || !session.userId) {
    redirect("/login");
  }

  const projects = await db.project.findMany({
    where: { authorId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-glass-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Projects</h1>
          <p className="text-sm text-foreground-muted mt-2">
            Manage your uploaded games and content.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="bg-gradient-to-r from-primary to-accent-cyan hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed bg-background-secondary/20">
          <div className="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mb-6 shadow-inner">
            <FolderX className="w-8 h-8 text-foreground-muted" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
          <p className="text-sm text-foreground-muted mb-8 max-w-md">
            You haven&apos;t uploaded any games or projects. Get started by creating your first showcase to share with the community.
          </p>
          <Link href="/dashboard/upload">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Create Your First Project
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} padding="none" className="flex flex-col overflow-hidden bg-background-secondary/10 backdrop-blur-md border border-glass-border hover:border-primary/50 transition-colors group">
              {/* Thumbnail Area */}
              <div className="relative h-40 bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center group-hover:from-background-tertiary group-hover:to-primary/10 transition-colors">
                <Gamepad2 className="w-12 h-12 text-foreground-dim/30 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute top-3 right-3">
                  <Badge variant="default" className="text-[10px] shadow-sm">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground group-hover:text-accent-cyan transition-colors line-clamp-1 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-foreground-muted line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  {/* Meta Stats */}
                  <div className="flex items-center justify-between text-xs text-foreground-dim bg-background-tertiary/50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5" title="Created At">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(project.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/project/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full justify-center group/btn">
                        <ExternalLink className="w-3.5 h-3.5 mr-2 group-hover/btn:text-primary" />
                        View Page
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="px-3" title="Settings">
                      <Settings className="w-4 h-4 text-foreground-dim" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
