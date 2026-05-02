"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { MatchParticipation, PlayerStats } from "@/types";

interface ParticipationTableProps {
  participations: MatchParticipation[];
  playerStats: PlayerStats[];
}

export function ParticipationTable({
  participations,
  playerStats,
}: ParticipationTableProps) {
  const getPlayerStats = (playerId: number) =>
    playerStats.find((s) => s.playerId === playerId);

  const resultVariant = (result: string) => {
    switch (result) {
      case "WIN":
        return "success";
      case "LOSS":
        return "danger";
      case "DRAW":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Result</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Kills</TableHead>
          <TableHead className="text-right">Deaths</TableHead>
          <TableHead className="text-right">Assists</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participations.map((p) => {
          const stats = getPlayerStats(p.playerId);
          return (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    fallback={p.player?.username || "?"}
                    size="sm"
                  />
                  <span className="font-medium">
                    {p.player?.username || "Unknown"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-text-muted">
                {p.team?.name || "Unknown"}
              </TableCell>
              <TableCell>
                <Badge variant={resultVariant(p.result)}>
                  {p.result}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-heading font-bold text-primary">
                {stats?.score || 0}
              </TableCell>
              <TableCell className="text-right text-success">
                {stats?.kills || 0}
              </TableCell>
              <TableCell className="text-right text-accent-2">
                {stats?.deaths || 0}
              </TableCell>
              <TableCell className="text-right text-accent">
                {stats?.assists || 0}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
