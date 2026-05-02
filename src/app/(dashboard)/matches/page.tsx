"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MatchCard } from "@/components/matches/MatchCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlideUp";
import type { Match } from "@/types";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const res = await fetch("/api/matches?limit=50");
      if (res.ok) {
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : data.data || []);
      }
      setLoading(false);
    }
    fetchMatches();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Matches" description="Browse match history" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No matches found</p>
        </div>
      ) : (
        <StaggerContainer className="space-y-3">
          {matches.map((match, i) => (
            <StaggerItem key={match.id}>
              <MatchCard match={match} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
