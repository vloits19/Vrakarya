import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

// ============================================================
// Button — reusable button with multiple variants
// ============================================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "relative bg-gradient-to-r from-accent-cyan via-primary to-accent-cyan text-white shadow-[0_0_20px_rgba(113, 142, 182,0.3)] hover:shadow-[0_0_30px_rgba(113, 142, 182,0.5)] hover:brightness-110 before:absolute before:inset-0 before:rounded-inherit before:p-[1px] before:bg-gradient-to-b before:from-white/30 before:to-transparent before:-z-10 before:mask-composite-exclude overflow-hidden",
  secondary:
    "bg-background-tertiary/50 backdrop-blur-md text-foreground border border-glass-border hover:border-glass-border-hover hover:bg-background-secondary shadow-lg",
  ghost:
    "bg-transparent text-foreground-muted hover:text-foreground hover:bg-background-tertiary/50",
  outline:
    "bg-transparent text-foreground border border-glass-border hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(113, 142, 182,0.15)]",
  danger:
    "bg-accent-rose/10 text-accent-rose border border-accent-rose/30 hover:bg-accent-rose/20 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-7 py-3 text-base rounded-xl gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:pointer-events-none",
          "active:scale-[0.97]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
