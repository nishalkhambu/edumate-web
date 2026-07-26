import * as React from "react";
import { cn } from "@/src/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "soft";

const variants: Record<Variant, string> = {
  primary:
    "gradient-primary text-white shadow-lg shadow-indigo-900/30 hover:shadow-xl hover:shadow-indigo-900/40 active:scale-[0.98]",
  ghost: "text-slate-300 hover:text-white hover:bg-white/5",
  outline:
    "border border-slate-700 text-slate-200 hover:bg-white/5 hover:border-slate-600",
  soft: "bg-white/5 text-slate-200 hover:bg-white/10 border border-white/5",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
