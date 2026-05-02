"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentMatches } from "@/components/dashboard/RecentMatches";
import { TopPlayers } from "@/components/dashboard/TopPlayers";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { Button } from "@/components/ui/Button";
import { SkeletonStats, SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlideUp";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Zap, Plus, UserPlus } from "lucide-react";
import type { DashboardStats, Match, Tournament, LeaderboardEntry } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, matchesRes, tournamentsRes, leaderboardRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/matches?limit=5"),
          fetch("/api/tournaments"),
          fetch("/api/leaderboard?limit=5"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (matchesRes.ok) {
          const data = await matchesRes.json();
          setMatches(Array.isArray(data) ? data : data.data || []);
        }
        if (tournamentsRes.ok) {
          const data = await tournamentsRes.json();
          const all = Array.isArray(data) ? data : data.data || [];
          setTournaments(all.filter((t: Tournament) => t.status !== "COMPLETED").slice(0, 3));
        }
        if (leaderboardRes.ok) {
          const data = await leaderboardRes.json();
          setTopPlayers(Array.isArray(data) ? data : data.data || []);
        }
      } catch {
        // silently handle fetch errors
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activities = [
    { id: 1, text: "New match completed: Sentinels vs Cloud9", time: new Date(Date.now() - 3600000).toISOString(), type: "match" as const },
    { id: 2, text: "Tournament 'Valorant Champions' is now LIVE", time: new Date(Date.now() - 7200000).toISOString(), type: "tournament" as const },
    { id: 3, text: "Player TenZ reached Level 50", time: new Date(Date.now() - 14400000).toISOString(), type: "player" as const },
    { id: 4, text: "System maintenance completed", time: new Date(Date.now() - 28800000).toISOString(), type: "system" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back to the Game Management System"
      >
        {isAdmin && (
          <div className="flex gap-2">
            <Link href="/admin/simulate">
              <Button variant="secondary" size="sm">
                <Zap size={14} /> Simulate
              </Button>
            </Link>
            <Link href="/players">
              <Button variant="ghost" size="sm">
                <UserPlus size={14} /> Add Player
              </Button>
            </Link>
          </div>
        )}
      </PageHeader>

      {/* Stats */}
      {loading ? (
        <SkeletonStats />
      ) : stats ? (
        <StatsGrid stats={stats} />
      ) : null}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={0.2}>
            {loading ? <SkeletonCard /> : <RecentMatches matches={matches} />}
          </FadeIn>

          {/* Active Tournaments */}
          {tournaments.length > 0 && (
            <FadeIn delay={0.4}>
              <h3 className="text-lg font-heading font-semibold text-text mb-4">
                Active Tournaments
              </h3>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tournaments.map((t, i) => (
                  <StaggerItem key={t.id}>
                    <TournamentCard tournament={t} index={i} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          )}
        </div>

        <div className="space-y-6">
          <FadeIn delay={0.3}>
            {loading ? <SkeletonCard /> : <TopPlayers players={topPlayers} />}
          </FadeIn>
          <FadeIn delay={0.5}>
            <ActivityFeed activities={activities} />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
