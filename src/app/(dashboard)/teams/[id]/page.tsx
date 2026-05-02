"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Shield, Gamepad2, Users } from "lucide-react";
import type { Team } from "@/types";
import Link from "next/link";

export default function TeamDetailPage() {
  const params = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      const res = await fetch(`/api/teams/${params.id}`);
      if (res.ok) setTeam(await res.json());
      setLoading(false);
    }
    fetchTeam();
  }, [params.id]);

  if (loading) return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>;

  if (!team) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-text-muted">Team not found</p>
        <Link href="/teams" className="text-accent text-sm hover:underline mt-2 inline-block">Back to Teams</Link>
      </div>
    );
  }

  const uniquePlayers = team.participations
    ? [...new Map(team.participations.map((p) => [p.playerId, p.player])).values()].filter(Boolean)
    : [];

  const wins = team.participations?.filter((p) => p.result === "WIN").length || 0;
  const losses = team.participations?.filter((p) => p.result === "LOSS").length || 0;

  return (
    <div className="space-y-6">
      <PageHeader title={team.name} description="Team Details" />

      <FadeIn>
        <div className="relative rounded-xl bg-gradient-to-r from-surface via-surface-2 to-surface border border-border/30 overflow-hidden">
          <div className="absolute inset-0 particle-grid opacity-20" />
          <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield size={36} className="text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-heading font-bold text-text">{team.name}</h2>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="default">
                  <Gamepad2 size={12} className="mr-1" />
                  {team.game?.name || "Unknown Game"}
                </Badge>
                <Badge variant="success">{wins}W</Badge>
                <Badge variant="danger">{losses}L</Badge>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {uniquePlayers.length > 0 && (
        <FadeIn delay={0.2}>
          <Card hoverEffect={false}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-accent" />
                <h3 className="font-heading font-semibold text-text">Team Members</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {uniquePlayers.map((player) =>
                player ? (
                  <Link key={player.id} href={`/players/${player.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-2/30 transition-colors">
                    <Avatar fallback={player.username} src={player.avatarUrl} size="sm" />
                    <span className="text-sm font-medium text-text hover:text-primary transition-colors">{player.username}</span>
                    <Badge variant={player.role === "ADMIN" ? "danger" : "outline"}>{player.role}</Badge>
                  </Link>
                ) : null
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
