import { Card } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProjectDevlogsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: Record<string, any>;
}

export function ProjectDevlogs({ project }: ProjectDevlogsProps) {
  const devlogs: { id: string; title: string; content: string; createdAt: string }[] = [];

  if (devlogs.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Development Log
        </h2>
        <Link href={`/feed?project=${project.id}`} className="text-sm text-foreground-muted hover:text-primary flex items-center transition-colors">
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4 border-l-2 border-background-tertiary ml-3 pl-6 relative">
        {devlogs.map((log) => (
          <div key={log.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-background border-2 border-primary z-10" />
            
            <Card hover className="p-5 bg-background-secondary/50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-foreground">{log.title}</h3>
                <span className="text-xs text-foreground-dim whitespace-nowrap ml-4">
                  {formatRelativeTime(log.createdAt)}
                </span>
              </div>
              <p className="text-sm text-foreground-muted line-clamp-3 mb-4">
                {log.content}
              </p>
              <Link href={`/post/${log.id}`} className="inline-flex items-center text-xs font-medium text-primary hover:underline">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Read Full Devlog
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
