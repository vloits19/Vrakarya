/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Avatar, Card, Button } from "@/components/ui";
import { Users, MapPin, ExternalLink } from "lucide-react";

export function CreatorIntro() {
  const developers: any[] = [];
  
  if (developers.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative bg-background-secondary/50 border-y border-background-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-medium mb-6">
              <Users className="w-3.5 h-3.5" />
              <span>The Community</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Meet the <span className="bg-gradient-to-r from-accent-cyan to-primary text-transparent bg-clip-text">Creators</span>
            </h2>
            <p className="text-foreground-muted text-lg leading-relaxed">
              Vrakarya is home to a diverse group of passionate indie developers, 
              artists, and musicians pushing the boundaries of game development.
            </p>
          </div>
          <Link href="/developers">
            <Button variant="outline" className="shrink-0">
              View All Creators
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer: any) => (
            <Link key={developer.id} href={`/profile/${developer.username}`}>
              <Card hover className="h-full flex flex-col p-6 group border-background-tertiary/50 bg-background/50 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar
                    src={developer.avatarUrl}
                    fallback={developer.displayName}
                    size="lg"
                    className="ring-2 ring-background ring-offset-2 ring-offset-background-secondary group-hover:ring-accent-cyan/50 transition-all duration-300"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-accent-cyan transition-colors">
                      {developer.displayName}
                    </h3>
                    <p className="text-sm text-foreground-dim mb-1">@{developer.username}</p>
                    {developer.location && (
                      <div className="flex items-center gap-1 text-xs text-foreground-muted">
                        <MapPin className="w-3 h-3" />
                        {developer.location}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-foreground-muted line-clamp-3 mb-6 flex-1">
                  {developer.bio}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs font-medium text-foreground-dim uppercase tracking-wider">
                    {developer.role}
                  </span>
                  <ExternalLink className="w-4 h-4 text-foreground-dim group-hover:text-accent-cyan transition-colors" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Cinematic gradient touches */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
