"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  glowColor?: "cyan" | "gold";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, glowColor = "cyan", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl bg-surface border border-border/50 card-glow overflow-hidden",
          hoverEffect &&
            "transition-all duration-200 hover:border-border",
          glowColor === "gold" && "card-glow-gold",
          className
        )}
        whileHover={
          hoverEffect
            ? {
                scale: 1.01,
                borderColor: glowColor === "gold" ? "#C89B3C" : "#0BC4FF",
              }
            : undefined
        }
        whileTap={hoverEffect ? { scale: 0.99 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-4 border-b border-border/30", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-3 border-t border-border/30", className)}
      {...props}
    >
      {children}
    </div>
  );
}
