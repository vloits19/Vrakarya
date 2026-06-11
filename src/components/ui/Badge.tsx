import { cn } from "@/lib/utils";

// ============================================================
// Badge — status/tag badges with color variants
// ============================================================

type BadgeVariant = "default" | "cyan" | "primary" | "accent" | "emerald" | "amber" | "rose" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-background-tertiary/50 backdrop-blur-md text-foreground-muted border-glass-border shadow-[0_0_10px_rgba(255,255,255,0.02)]",
  cyan: "bg-accent-cyan/10 backdrop-blur-md text-accent-cyan border-accent-cyan/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
  primary: "bg-primary/10 backdrop-blur-md text-primary border-primary/40 shadow-[0_0_15px_rgba(113, 142, 182,0.15)]",
  accent: "bg-accent-cyan/10 backdrop-blur-md text-accent-cyan border-accent-cyan/40 shadow-[0_0_15px_rgba(0, 214, 182,0.15)]",
  emerald: "bg-accent-emerald/10 backdrop-blur-md text-accent-emerald border-accent-emerald/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  amber: "bg-accent-amber/10 backdrop-blur-md text-accent-amber border-accent-amber/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  rose: "bg-accent-rose/10 backdrop-blur-md text-accent-rose border-accent-rose/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
  outline: "bg-background-tertiary/20 backdrop-blur-md text-foreground-muted border-glass-border hover:border-glass-border-hover hover:text-foreground",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        "transition-colors duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
