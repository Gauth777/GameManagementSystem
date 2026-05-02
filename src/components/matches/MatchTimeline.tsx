"use client";

import React from "react";
import { formatDateTime } from "@/lib/utils";
import type { Match } from "@/types";
import { motion } from "framer-motion";

interface MatchTimelineProps {
  matches: Match[];
}

export function MatchTimeline({ matches }: MatchTimelineProps) {
  if (matches.length === 0) {
    return <p className="text-sm text-text-muted">No matches to display</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border/30" />
      <div className="space-y-4">
        {matches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="relative pl-10"
          >
            <div className="absolute left-[11px] top-3 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
            <div className="bg-surface-2/50 rounded-lg border border-border/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">
                  {match.gameMode?.name || "Match"}{" "}
                  <span className="text-text-muted">({match.matchType})</span>
                </p>
                <span className="text-xs text-text-muted">
                  {formatDateTime(match.matchDate)}
                </span>
              </div>
              {match.participations && match.participations.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                  {[...new Set(match.participations.map((p) => p.team?.name).filter(Boolean))].map(
                    (team, j) => (
                      <span key={j}>
                        {j > 0 && <span className="text-primary mx-1">vs</span>}
                        {team}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
