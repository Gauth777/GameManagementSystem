"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import type { LeaderboardEntry } from "@/types";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : data.data || []);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Leaderboard" description="Global player rankings" />

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonCard />
        </div>
      ) : (
        <FadeIn>
          <LeaderboardTable entries={entries} />
        </FadeIn>
      )}
    </div>
  );
}
