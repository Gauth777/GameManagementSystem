"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlayerCard } from "@/components/players/PlayerCard";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlideUp";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Player } from "@/types";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await fetch(`/api/players?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : data.data || []);
      }
      setLoading(false);
    }
    fetchPlayers();
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <PageHeader title="Players" description="Browse and manage player profiles">
        <div className="w-64">
          <Input
            placeholder="Search players..."
            icon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No players found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player, i) => (
            <StaggerItem key={player.id}>
              <PlayerCard player={player} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
