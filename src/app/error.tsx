"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import { ParallaxBackground } from "@/components/effects/ParallaxBackground";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Platform Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 text-center">
      {/* We add ParallaxBackground here in case the layout fails entirely */}
      <ParallaxBackground />
      
      <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-accent-rose" />
      </div>
      
      <h1 className="text-4xl font-bold text-foreground mb-4 font-heading">
        System <span className="text-accent-rose">Failure</span>
      </h1>
      
      <p className="text-foreground-muted mb-8 max-w-md">
        An unexpected error occurred in the platform renderer. The simulation has been paused.
      </p>
      
      <div className="flex gap-4">
        <Button variant="primary" onClick={() => reset()}>
          Retry Simulation
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Return to Hub
        </Button>
      </div>
    </div>
  );
}
