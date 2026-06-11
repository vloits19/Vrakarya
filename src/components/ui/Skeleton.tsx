import { cn } from "@/lib/utils";

// ============================================================
// Skeleton — animated loading placeholder
// ============================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Renders as a circle when true */
  circle?: boolean;
}

export function Skeleton({ className, circle, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer",
        circle ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    />
  );
}
