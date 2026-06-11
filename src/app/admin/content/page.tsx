"use client";

import { useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Star, Trash2, Edit2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";

export default function AdminContentPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const toggleFeatured = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    ));
  };

  const deleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Content Manager</h2>
        <p className="text-sm text-foreground-muted">Manage all projects uploaded to the platform.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-tertiary border-b border-glass-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground-muted uppercase tracking-wider text-xs">Project</th>
                <th className="px-6 py-4 font-semibold text-foreground-muted uppercase tracking-wider text-xs">Author</th>
                <th className="px-6 py-4 font-semibold text-foreground-muted uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold text-foreground-muted uppercase tracking-wider text-xs text-center">Featured</th>
                <th className="px-6 py-4 font-semibold text-foreground-muted uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-background-tertiary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {project.title}
                      <Link href={`/project/${project.slug}`} target="_blank">
                        <ExternalLink className="w-3 h-3 text-foreground-muted hover:text-accent-cyan" />
                      </Link>
                    </div>
                    <div className="text-xs text-foreground-dim mt-1 truncate max-w-[200px]">
                      {project.shortDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-foreground">@{project.developer.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={project.status === "released" ? "emerald" : "primary"} className="text-[10px] uppercase">
                      {project.status.replace("-", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleFeatured(project.id)}
                      className={`p-2 rounded-full transition-colors ${
                        project.isFeatured 
                          ? "bg-accent-amber/20 text-accent-amber" 
                          : "bg-background-secondary text-foreground-dim hover:text-foreground hover:bg-background-tertiary"
                      }`}
                      title="Toggle Featured Status"
                    >
                      <Star className={`w-4 h-4 ${project.isFeatured ? "fill-current" : ""}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="px-2">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="px-2 text-accent-rose hover:text-accent-rose hover:border-accent-rose hover:bg-accent-rose/10" onClick={() => deleteProject(project.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
