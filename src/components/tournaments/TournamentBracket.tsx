"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import type { Match } from "@/types";
import { motion } from "framer-motion";

interface TournamentBracketProps {
  matches: Match[];
}

export function TournamentBracket({ matches }: TournamentBracketProps) {
  if (matches.length === 0) {
    return (
      <Card hoverEffect={false}>
        <CardContent>
          <p className="text-sm text-text-muted text-center py-6">
            No matches scheduled for this tournament
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match, i) => {
        const teams = match.participations
          ? [...new Set(match.participations.map((p) => ({
              name: p.team?.name || "TBD",
              result: p.result,
            })
          ))]
          : [];

        const uniqueTeams = teams.reduce<{ name: string; result: string }[]>((acc, curr) => {
          if (!acc.find((t) => t.name === curr.name)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        return (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Card hoverEffect={false}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-heading">
                    Match {i + 1}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatDateTime(match.matchDate)}
                  </span>
                </div>
                <div className="space-y-2">
                  {uniqueTeams.slice(0, 2).map((team, j) => (
                    <div
                      key={j}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg border ${
                        team.result === "WIN"
                          ? "border-success/30 bg-success/5"
                          : "border-border/20 bg-surface-2/30"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          team.result === "WIN" ? "text-success" : "text-text"
                        }`}
                      >
                        {team.name}
                      </span>
                      {team.result !== "PENDING" && (
                        <Badge
                          variant={
                            team.result === "WIN"
                              ? "success"
                              : team.result === "LOSS"
                              ? "danger"
                              : "outline"
                          }
                        >
                          {team.result}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
