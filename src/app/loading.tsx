import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 flex flex-col justify-center">
      <div className="space-y-4">
        {/* Simulating Page Header Skeleton */}
        <Skeleton className="h-10 w-48 bg-background-tertiary" />
        <Skeleton className="h-4 w-96 bg-background-tertiary" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-card p-5 space-y-4 border border-glass-border bg-background-secondary/30"
          >
            {/* Image Placeholder */}
            <Skeleton className="h-40 w-full bg-background-tertiary" />
            
            {/* Header/Title Placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3 bg-background-tertiary" />
              <Skeleton className="h-4 w-full bg-background-tertiary" />
            </div>

            {/* Tags/Badges Placeholder */}
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12 bg-background-tertiary" />
              <Skeleton className="h-5 w-16 bg-background-tertiary" />
            </div>

            {/* Author Row Placeholder */}
            <div className="flex items-center justify-between pt-4 border-t border-glass-border">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full bg-background-tertiary" />
                <Skeleton className="h-4 w-20 bg-background-tertiary" />
              </div>
              <Skeleton className="h-4 w-12 bg-background-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
