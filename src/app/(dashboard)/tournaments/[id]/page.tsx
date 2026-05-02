"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TournamentBracket } from "@/components/tournaments/TournamentBracket";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { GlowPulse } from "@/components/animations/GlowPulse";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Crown, Calendar, DollarSign } from "lucide-react";
import type { Tournament } from "@/types";
import Link from "next/link";

export default function TournamentDetailPage() {
  const params = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournament() {
      const res = await fetch(`/api/tournaments/${params.id}`);
      if (res.ok) setTournament(await res.json());
      setLoading(false);
    }
    fetchTournament();
  }, [params.id]);

  if (loading) return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>;

  if (!tournament) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-text-muted">Tournament not found</p>
        <Link href="/tournaments" className="text-accent text-sm hover:underline mt-2 inline-block">Back to Tournaments</Link>
      </div>
    );
  }

  const statusConfig = {
    UPCOMING: { variant: "default" as const, label: "Upcoming" },
    ONGOING: { variant: "success" as const, label: "Live" },
    COMPLETED: { variant: "outline" as const, label: "Completed" },
  };
  const status = statusConfig[tournament.status];

  return (
    <div className="space-y-6">
      <PageHeader title={tournament.name} description="Tournament Details" />

      {/* Hero Banner */}
      <FadeIn>
        <div className="relative rounded-xl bg-gradient-to-r from-surface via-surface-2 to-surface border border-border/30 overflow-hidden">
          <div className="absolute inset-0 particle-grid opacity-20" />
          <div className="relative px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Crown size={30} className="text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-heading font-bold text-text">{tournament.name}</h2>
                  {tournament.status === "ONGOING" ? (
                    <GlowPulse color="gold" className="rounded-md">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </GlowPulse>
                  ) : (
                    <Badge variant={status.variant}>{status.label}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={14} className="text-primary" />
                    <span className="font-heading font-bold text-primary text-lg">
                      {formatCurrency(Number(tournament.prizePool))}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(tournament.startDate)} → {formatDate(tournament.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Match Bracket */}
      <FadeIn delay={0.2}>
        <Card hoverEffect={false}>
          <CardHeader>
            <h3 className="font-heading font-semibold text-text">Tournament Matches</h3>
          </CardHeader>
          <CardContent>
            <TournamentBracket matches={tournament.matches || []} />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
