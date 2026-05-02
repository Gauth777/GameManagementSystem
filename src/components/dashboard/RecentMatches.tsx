"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Match } from "@/types";
import Link from "next/link";
import { Swords } from "lucide-react";

interface RecentMatchesProps {
  matches: Match[];
}

export function RecentMatches({ matches }: RecentMatchesProps) {
  return (
    <Card hoverEffect={false}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Swords size={18} className="text-primary" />
          <h3 className="font-heading font-semibold text-text">Recent Matches</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {matches.length === 0 ? (
          <p className="text-sm text-text-muted px-5 py-4">No recent matches</p>
        ) : (
          matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-surface-2/30 transition-colors border-b border-border/10 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                  <Swords size={14} className="text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {match.gameMode?.name || "Match"} — {match.gameMode?.game?.name || ""}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatRelativeTime(match.matchDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    match.matchType === "Tournament"
                      ? "gold"
                      : match.matchType === "Ranked"
                      ? "default"
                      : "outline"
                  }
                >
                  {match.matchType}
                </Badge>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
