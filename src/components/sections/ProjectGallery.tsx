/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { ScrollReveal } from "@/components/effects/ScrollReveal";

interface ProjectGalleryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: Record<string, any>;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  // Use real gallery images if available, otherwise use placeholders
  const gallery = project.galleryImages?.length > 0 
    ? project.galleryImages 
    : [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
      ];

  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <ScrollReveal delay={0.2} direction="up">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="w-1.5 h-6 bg-accent-cyan rounded-full" />
          Media Gallery
        </h2>
        
        {/* Main Showcase Image */}
        <Card padding="none" className="overflow-hidden bg-background-tertiary">
          <div className="relative aspect-video w-full">
            <img 
              src={activeImage} 
              alt="Gallery showcase" 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
        </Card>

        {/* Thumbnail Strip */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {gallery.map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative shrink-0 w-32 md:w-40 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === img 
                  ? "border-accent-cyan ring-2 ring-accent-cyan/20 ring-offset-2 ring-offset-background" 
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
