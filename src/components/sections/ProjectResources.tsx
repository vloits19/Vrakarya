import { Card } from "@/components/ui";
import { ResourceType } from "@/types";
import { Code, Video, Camera, HardDrive, Gamepad2, Link as LinkIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectResourcesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: Record<string, any>;
}

const RESOURCE_STYLES: Record<ResourceType, { icon: React.ComponentType<{ className?: string }>; colorClass: string; label: string }> = {
  github: { icon: Code, colorClass: "text-white bg-[#181717]", label: "GitHub" },
  itchio: { icon: Gamepad2, colorClass: "text-white bg-[#FA5C5C]", label: "Itch.io" },
  gdrive: { icon: HardDrive, colorClass: "text-white bg-[#1FA463]", label: "Google Drive" },
  youtube: { icon: Video, colorClass: "text-white bg-[#FF0000]", label: "YouTube" },
  instagram: { icon: Camera, colorClass: "text-white bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]", label: "Instagram" },
  website: { icon: LinkIcon, colorClass: "text-accent-cyan bg-accent-cyan/10", label: "Website" },
  other: { icon: LinkIcon, colorClass: "text-foreground bg-background-tertiary", label: "External Link" },
};

export function ProjectResources({ project }: ProjectResourcesProps) {
  if (!project.externalResources || project.externalResources.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent-rose rounded-full" />
        External Resources
      </h2>
      <p className="text-sm text-foreground-muted mb-4">
        Downloads, source code, and additional media for this project.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {project.externalResources?.map((resource: { id: string; type: string; url: string; title: string }) => {
          const style = RESOURCE_STYLES[resource.type as ResourceType] || RESOURCE_STYLES.other;
          const Icon = style.icon;

          return (
            <Link key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">
              <Card hover padding="none" className="p-4 flex items-center gap-4 bg-background-secondary/50 group border border-glass-border hover:border-accent-cyan/50 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground-dim uppercase tracking-wider mb-0.5">
                    {style.label}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent-cyan transition-colors">
                    {resource.title}
                  </h3>
                </div>
                <ExternalLink className="w-4 h-4 text-foreground-dim opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
