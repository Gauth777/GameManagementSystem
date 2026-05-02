import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-surface-2 border border-border/60 rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60",
              "hover:border-border",
              icon && "pl-10",
              error && "border-accent-2/60 focus:ring-accent-2/40",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-accent-2 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
