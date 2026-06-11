import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectTrailer } from "@/components/sections/ProjectTrailer";
import { ProjectSidebar } from "@/components/sections/ProjectSidebar";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { ProjectDevlogs } from "@/components/sections/ProjectDevlogs";
import { RelatedProjects } from "@/components/sections/RelatedProjects";
import { ProjectResources } from "@/components/sections/ProjectResources";
import { ProjectDiscussions } from "@/components/sections/ProjectDiscussions";
import { getDiscussions } from "@/app/actions/discussions";
import { verifySession } from "@/lib/auth";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

import { db } from "@/config/database";

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { id: slug } });

  if (!project) {
    return {
      title: "Project Not Found — Vrakarya",
    };
  }

  return {
    title: `${project.title} — Vrakarya`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  // Find project by ID (slug is used as ID)
  const project = await db.project.findUnique({ 
    where: { id: slug },
    include: {
      author: true
    }
  });

  if (!project) {
    notFound();
  }

  const session = await verifySession();
  const discussions = await getDiscussions(project.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back to Feed */}
      <Link
        href="/feed"
        className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Link>

      {/* Cinematic Trailer / Banner */}
      <ProjectTrailer project={project} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-10">
        
        {/* Main Content (Left Column) */}
        <div className="xl:col-span-8 space-y-14">
          
          {/* About / Description */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-emerald rounded-full" />
              About This Project
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground-muted leading-relaxed text-lg">
                {project.description}
              </p>
            </div>
          </section>

          {/* Screenshot Gallery */}
          <ProjectGallery project={project} />

          {/* External Resources */}
          <ProjectResources project={project} />

          {/* Development Logs */}
          <ProjectDevlogs project={project} />

          {/* Project Discussions */}
          <section className="space-y-4 pt-10 border-t border-glass-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-rose rounded-full" />
              Community Discussion
            </h2>
            <ProjectDiscussions 
              projectId={project.id} 
              initialDiscussions={discussions}
              currentUserId={session.userId || undefined} 
            />
          </section>
          
        </div>

        {/* Sidebar (Right Column) */}
        <aside className="xl:col-span-4 space-y-10">
          <ProjectSidebar project={project} />
          <RelatedProjects currentProject={project} />
        </aside>

      </div>
    </div>
  );
}
