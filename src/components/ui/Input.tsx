import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

// ============================================================
// Input — styled text input with label
// ============================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground-muted mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-4 py-2.5 text-sm rounded-lg",
            "bg-background-secondary text-foreground placeholder:text-foreground-dim",
            "border border-glass-border",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
            "transition-all duration-200",
            error && "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-accent-rose">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
