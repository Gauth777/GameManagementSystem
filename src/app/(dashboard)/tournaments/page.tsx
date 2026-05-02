"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlideUp";
import type { Tournament } from "@/types";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      const res = await fetch("/api/tournaments");
      if (res.ok) {
        const data = await res.json();
        setTournaments(Array.isArray(data) ? data : data.data || []);
      }
      setLoading(false);
    }
    fetchTournaments();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Tournaments" description="Competitive events and prizes" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No tournaments found</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((t, i) => (
            <StaggerItem key={t.id}>
              <TournamentCard tournament={t} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
