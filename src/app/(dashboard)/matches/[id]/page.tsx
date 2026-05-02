"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ParticipationTable } from "@/components/matches/ParticipationTable";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { formatDateTime } from "@/lib/utils";
import { Swords, Calendar, Trophy } from "lucide-react";
import type { Match } from "@/types";
import Link from "next/link";

export default function MatchDetailPage() {
  const params = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      const res = await fetch(`/api/matches/${params.id}`);
      if (res.ok) setMatch(await res.json());
      setLoading(false);
    }
    fetchMatch();
  }, [params.id]);

  if (loading) return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>;

  if (!match) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-text-muted">Match not found</p>
        <Link href="/matches" className="text-accent text-sm hover:underline mt-2 inline-block">Back to Matches</Link>
      </div>
    );
  }

  const teams = match.participations
    ? [...new Set(match.participations.map((p) => p.team?.name).filter(Boolean))]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title={`Match #${match.id}`} description="Match Details" />

      {/* Match Info Banner */}
      <FadeIn>
        <div className="relative rounded-xl bg-gradient-to-r from-surface via-surface-2 to-surface border border-border/30 overflow-hidden">
          <div className="absolute inset-0 particle-grid opacity-20" />
          <div className="relative px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center">
                  <Swords size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-text">
                    {match.gameMode?.game?.name} — {match.gameMode?.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant={match.matchType === "Tournament" ? "gold" : match.matchType === "Ranked" ? "default" : "outline"}>
                      {match.matchType}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <Calendar size={14} />
                      {formatDateTime(match.matchDate)}
                    </span>
                  </div>
                </div>
              </div>
              {teams.length >= 2 && (
                <div className="text-center">
                  <p className="text-lg font-heading font-bold">
                    <span className="text-accent">{teams[0]}</span>
                    <span className="text-text-muted mx-3">vs</span>
                    <span className="text-accent-2">{teams[1]}</span>
                  </p>
                </div>
              )}
            </div>
            {match.tournament && (
              <div className="mt-4 flex items-center gap-2">
                <Trophy size={14} className="text-primary" />
                <Link href={`/tournaments/${match.tournamentId}`} className="text-sm text-primary hover:underline">
                  {match.tournament.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Participation & Stats Table */}
      <FadeIn delay={0.2}>
        <Card hoverEffect={false}>
          <CardHeader>
            <h3 className="font-heading font-semibold text-text">Player Performance</h3>
          </CardHeader>
          <CardContent className="p-0">
            <ParticipationTable
              participations={match.participations || []}
              playerStats={match.playerStats || []}
            />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
