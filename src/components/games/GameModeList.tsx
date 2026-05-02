"use client";

import React from "react";
import type { GameMode } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Swords } from "lucide-react";
import { motion } from "framer-motion";

interface GameModeListProps {
  modes: GameMode[];
}

export function GameModeList({ modes }: GameModeListProps) {
  if (!modes || modes.length === 0) {
    return (
      <p className="text-sm text-text-muted">No game modes available</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {modes.map((mode, i) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          <Card hoverEffect className="h-full">
            <CardContent className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent flex-shrink-0 mt-0.5">
                <Swords size={16} />
              </div>
              <div>
                <h4 className="text-sm font-heading font-semibold text-text">
                  {mode.name}
                </h4>
                {mode.description && (
                  <p className="text-xs text-text-muted mt-1">
                    {mode.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
