"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { GameModeList } from "@/components/games/GameModeList";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { formatDate } from "@/lib/utils";
import { Building2, Calendar, Gamepad2, Users, Shield } from "lucide-react";
import type { Game } from "@/types";
import Link from "next/link";

export default function GameDetailPage() {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGame() {
      const res = await fetch(`/api/games/${params.id}`);
      if (res.ok) setGame(await res.json());
      setLoading(false);
    }
    fetchGame();
  }, [params.id]);

  if (loading) return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>;

  if (!game) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-text-muted">Game not found</p>
        <Link href="/games" className="text-accent text-sm hover:underline mt-2 inline-block">Back to Games</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={game.name} description={`${game.genre} Game`} />

      {/* Hero Banner */}
      <FadeIn>
        <div className="relative rounded-xl bg-gradient-to-r from-surface via-surface-2 to-surface border border-border/30 overflow-hidden">
          <div className="absolute inset-0 particle-grid opacity-20" />
          <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gold-gradient/10 border border-primary/20 flex items-center justify-center">
              <Gamepad2 size={36} className="text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-text">{game.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge variant="default">{game.genre}</Badge>
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Building2 size={14} />
                  {game.company?.name}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Calendar size={14} />
                  {formatDate(game.releaseDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Game Modes */}
      <FadeIn delay={0.2}>
        <h3 className="text-lg font-heading font-semibold text-text mb-4">Game Modes</h3>
        <GameModeList modes={game.gameModes || []} />
      </FadeIn>

      {/* Characters */}
      {game.characters && game.characters.length > 0 && (
        <FadeIn delay={0.3}>
          <h3 className="text-lg font-heading font-semibold text-text mb-4">Characters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {game.characters.map((char) => (
              <Card key={char.id} hoverEffect className="text-center">
                <CardContent className="py-5">
                  <div className="w-12 h-12 mx-auto rounded-full bg-surface-2 flex items-center justify-center mb-2">
                    <Users size={20} className="text-accent" />
                  </div>
                  <p className="text-sm font-medium text-text">{char.name}</p>
                  <Badge variant="outline" className="mt-1">{char.role}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Teams */}
      {game.teams && game.teams.length > 0 && (
        <FadeIn delay={0.4}>
          <h3 className="text-lg font-heading font-semibold text-text mb-4">Teams</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {game.teams.map((team) => (
              <Link key={team.id} href={`/teams/${team.id}`}>
                <Card className="cursor-pointer">
                  <CardContent className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                      <Shield size={18} className="text-primary" />
                    </div>
                    <span className="font-medium text-text">{team.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
