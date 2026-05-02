"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GameCard } from "@/components/games/GameCard";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlideUp";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Game } from "@/types";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      const res = await fetch("/api/games");
      if (res.ok) {
        const data = await res.json();
        const all = Array.isArray(data) ? data : data.data || [];
        setGames(
          debouncedSearch
            ? all.filter((g: Game) =>
                g.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                g.genre.toLowerCase().includes(debouncedSearch.toLowerCase())
              )
            : all
        );
      }
      setLoading(false);
    }
    fetchGames();
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <PageHeader title="Games" description="Browse the game library">
        <div className="w-64">
          <Input
            placeholder="Search games..."
            icon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No games found</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((game, i) => (
            <StaggerItem key={game.id}>
              <GameCard game={game} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
