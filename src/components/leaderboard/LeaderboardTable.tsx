"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent } from "@/components/ui/Card";
import type { LeaderboardEntry } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const rankStyles: Record<number, string> = {
  1: "text-primary font-bold text-xl",
  2: "text-text-muted font-bold text-lg",
  3: "text-warning font-bold text-lg",
};

const rankBg: Record<number, string> = {
  1: "bg-primary/5 border-primary/20",
  2: "bg-text-muted/5 border-text-muted/20",
  3: "bg-warning/5 border-warning/20",
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <Card hoverEffect={false}>
        <CardContent>
          <p className="text-sm text-text-muted text-center py-8">
            No leaderboard data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Top 3 hero cards
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Top 3 Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <Link href={`/players/${entry.id}`}>
              <Card
                glowColor="gold"
                className={`cursor-pointer text-center py-6 border ${rankBg[entry.rank] || ""}`}
              >
                <CardContent>
                  <span className={rankStyles[entry.rank] || "text-text font-bold"}>
                    #{entry.rank}
                  </span>
                  <div className="my-3 flex justify-center">
                    <Avatar
                      fallback={entry.username}
                      src={entry.avatarUrl}
                      size="lg"
                      className={
                        entry.rank === 1
                          ? "border-primary"
                          : entry.rank === 2
                          ? "border-text-muted"
                          : "border-warning"
                      }
                    />
                  </div>
                  <h3 className="font-heading font-bold text-text text-lg">
                    {entry.username}
                  </h3>
                  <p className="text-2xl font-heading font-bold text-primary mt-1">
                    {entry.totalScore.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-2 text-xs text-text-muted">
                    <span>
                      <span className="text-success">{entry.wins}</span> W
                    </span>
                    <span>KD: {entry.kdRatio}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Rank 4+ Table */}
      {rest.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">K/D</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rest.map((entry, i) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  className="border-b border-border/20 transition-colors hover:bg-surface-2/30 even:bg-surface-2/10"
                >
                  <TableCell className="font-heading font-bold text-text-muted">
                    #{entry.rank}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/players/${entry.id}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <Avatar
                        fallback={entry.username}
                        src={entry.avatarUrl}
                        size="sm"
                      />
                      <span className="font-medium">{entry.username}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-heading font-bold text-primary">
                    {entry.totalScore.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    {entry.wins}
                  </TableCell>
                  <TableCell className="text-right text-text-muted">
                    {entry.kdRatio}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
