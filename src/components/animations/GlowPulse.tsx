"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface GlowPulseProps {
  children: React.ReactNode;
  className?: string;
  color?: "cyan" | "gold" | "red";
}

export function GlowPulse({
  children,
  className,
  color = "cyan",
}: GlowPulseProps) {
  const glowColors = {
    cyan: "rgba(11, 196, 255, 0.4)",
    gold: "rgba(200, 155, 60, 0.4)",
    red: "rgba(255, 70, 85, 0.4)",
  };

  return (
    <motion.div
      className={cn("relative", className)}
      animate={{
        boxShadow: [
          `0 0 10px ${glowColors[color]}`,
          `0 0 25px ${glowColors[color]}`,
          `0 0 10px ${glowColors[color]}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
