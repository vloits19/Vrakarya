import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

// ============================================================
// Avatar — user avatar with fallback initials
// ============================================================

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export function Avatar({ src, fallback, size = "md", className }: AvatarProps) {
  const initials = getInitials(fallback);

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden ring-2 ring-glass-border ring-offset-2 ring-offset-background flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 hover:ring-primary/50 hover:shadow-[0_0_20px_rgba(113, 142, 182,0.2)]",
          sizeStyles[size],
          className
        )}
      >
        <Image
          src={src}
          alt={fallback}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        "bg-gradient-to-br from-primary to-accent-cyan text-white",
        "ring-2 ring-glass-border ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(113, 142, 182,0.15)] transition-all duration-300 hover:ring-accent-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        sizeStyles[size],
        className
      )}
      aria-label={fallback}
    >
      {initials}
    </div>
  );
}
