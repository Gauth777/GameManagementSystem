"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/types";
import Link from "next/link";

interface TopPlayersProps {
  players: LeaderboardEntry[];
}

const rankColors = ["text-primary", "text-text-muted", "text-warning"];
const rankLabels = ["🥇", "🥈", "🥉"];

export function TopPlayers({ players }: TopPlayersProps) {
  return (
    <Card hoverEffect={false}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          <h3 className="font-heading font-semibold text-text">Top Players</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        {players.length === 0 ? (
          <p className="text-sm text-text-muted px-5 py-4">No player data</p>
        ) : (
          players.slice(0, 5).map((player, i) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2/30 transition-colors border-b border-border/10 last:border-0"
            >
              <span className="text-lg w-8 text-center">
                {i < 3 ? rankLabels[i] : `#${i + 1}`}
              </span>
              <Avatar fallback={player.username} size="sm" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${i < 3 ? rankColors[i] : "text-text"}`}>
                  {player.username}
                </p>
                <p className="text-xs text-text-muted">
                  KD: {player.kdRatio} • {player.wins} wins
                </p>
              </div>
              <span className="text-sm font-heading font-bold text-primary">
                {player.totalScore.toLocaleString()}
              </span>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
