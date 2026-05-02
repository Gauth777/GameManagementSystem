"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import type { Match } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, Clock, Trophy } from "lucide-react";

interface MatchCardProps {
  match: Match;
  index?: number;
}

export function MatchCard({ match, index = 0 }: MatchCardProps) {
  const teams = match.participations
    ? [...new Set(match.participations.map((p) => p.team?.name).filter(Boolean))]
    : [];

  const hasWinner = match.participations?.some((p) => p.result === "WIN");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link href={`/matches/${match.id}`}>
        <Card className="group cursor-pointer">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                <Swords size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                  {match.gameMode?.name || "Match"}{" "}
                  {match.gameMode?.game?.name && (
                    <span className="text-text-muted">— {match.gameMode.game.name}</span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock size={11} />
                    {formatDateTime(match.matchDate)}
                  </span>
                  {teams.length >= 2 && (
                    <span className="text-xs text-text-muted">
                      {teams[0]} vs {teams[1]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {match.tournament && (
                <Badge variant="gold">
                  <Trophy size={10} className="mr-1" />
                  Tournament
                </Badge>
              )}
              <Badge
                variant={
                  match.matchType === "Ranked"
                    ? "default"
                    : match.matchType === "Tournament"
                    ? "gold"
                    : "outline"
                }
              >
                {match.matchType}
              </Badge>
              {hasWinner && (
                <Badge variant="success">Completed</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
