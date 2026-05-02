"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlideUp";
import { Shield } from "lucide-react";
import type { Team } from "@/types";
import Link from "next/link";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const res = await fetch("/api/teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(Array.isArray(data) ? data : data.data || []);
      }
      setLoading(false);
    }
    fetchTeams();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Teams" description="Browse competitive teams" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No teams found</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, i) => (
            <StaggerItem key={team.id}>
              <Link href={`/teams/${team.id}`}>
                <Card glowColor="gold" className="group cursor-pointer h-full">
                  <CardContent className="flex items-center gap-4 py-5">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                      <Shield size={24} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg font-bold text-text group-hover:text-primary transition-colors truncate">
                        {team.name}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {team.game?.name || "Unknown Game"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
