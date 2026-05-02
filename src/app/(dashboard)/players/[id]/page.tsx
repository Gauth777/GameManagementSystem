"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlayerProfile } from "@/components/players/PlayerProfile";
import { PlayerStatsChart } from "@/components/players/PlayerStatsChart";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { formatDateTime } from "@/lib/utils";
import type { Player, PlayerStats } from "@/types";
import Link from "next/link";

export default function PlayerDetailPage() {
  const params = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayer() {
      const res = await fetch(`/api/players/${params.id}`);
      if (res.ok) setPlayer(await res.json());
      setLoading(false);
    }
    fetchPlayer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-text-muted">Player not found</p>
        <Link href="/players" className="text-accent text-sm hover:underline mt-2 inline-block">
          Back to Players
        </Link>
      </div>
    );
  }

  const allStats = player.stats || [];
  const totalScore = allStats.reduce((s, st) => s + st.score, 0);
  const totalKills = allStats.reduce((s, st) => s + st.kills, 0);
  const totalDeaths = allStats.reduce((s, st) => s + st.deaths, 0);
  const totalAssists = allStats.reduce((s, st) => s + st.assists, 0);
  const wins = player.matchParticipations?.filter((p) => p.result === "WIN").length || 0;

  return (
    <div className="space-y-6">
      <PageHeader title={player.username} description="Player Profile" />

      <PlayerProfile
        player={player}
        totalStats={{
          totalScore,
          totalKills,
          totalDeaths,
          totalAssists,
          totalMatches: allStats.length,
          wins,
        }}
      />

      {/* Charts */}
      <FadeIn delay={0.3}>
        <PlayerStatsChart stats={allStats} />
      </FadeIn>

      {/* Game Accounts */}
      {player.gameAccounts && player.gameAccounts.length > 0 && (
        <FadeIn delay={0.4}>
          <Card hoverEffect={false}>
            <CardHeader>
              <h3 className="font-heading font-semibold text-text">Game Accounts</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {player.gameAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text">{acc.game?.name || "Unknown Game"}</p>
                    <p className="text-xs text-text-muted">Level {acc.accountLevel}</p>
                  </div>
                  <div className="w-40">
                    <ProgressBar value={acc.accountLevel} max={100} showLabel />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Match History */}
      <FadeIn delay={0.5}>
        <Card hoverEffect={false}>
          <CardHeader>
            <h3 className="font-heading font-semibold text-text">Match History</h3>
          </CardHeader>
          <CardContent className="p-0">
            {allStats.length === 0 ? (
              <p className="text-sm text-text-muted px-5 py-6 text-center">No match history</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Match</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">K</TableHead>
                    <TableHead className="text-right">D</TableHead>
                    <TableHead className="text-right">A</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allStats.slice(0, 15).map((stat) => {
                    const participation = player.matchParticipations?.find(
                      (p) => p.matchId === stat.matchId
                    );
                    return (
                      <TableRow key={stat.id}>
                        <TableCell>
                          <Link href={`/matches/${stat.matchId}`} className="text-accent hover:underline">
                            Match #{stat.matchId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {participation && (
                            <Badge
                              variant={
                                participation.result === "WIN"
                                  ? "success"
                                  : participation.result === "LOSS"
                                  ? "danger"
                                  : "outline"
                              }
                            >
                              {participation.result}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-heading font-bold text-primary">
                          {stat.score}
                        </TableCell>
                        <TableCell className="text-right text-success">{stat.kills}</TableCell>
                        <TableCell className="text-right text-accent-2">{stat.deaths}</TableCell>
                        <TableCell className="text-right text-accent">{stat.assists}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
