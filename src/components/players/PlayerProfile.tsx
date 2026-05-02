"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, calculateKDRatio } from "@/lib/utils";
import type { Player, PlayerStats } from "@/types";
import { Calendar, Shield, Crosshair, Target, Heart } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

interface PlayerProfileProps {
  player: Player;
  totalStats?: {
    totalScore: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalMatches: number;
    wins: number;
  };
}

export function PlayerProfile({ player, totalStats }: PlayerProfileProps) {
  const stats = totalStats || {
    totalScore: 0,
    totalKills: 0,
    totalDeaths: 0,
    totalAssists: 0,
    totalMatches: 0,
    wins: 0,
  };

  const statCards = [
    { label: "Total Matches", value: stats.totalMatches, icon: <Crosshair size={18} />, color: "text-accent" },
    { label: "Wins", value: stats.wins, icon: <Shield size={18} />, color: "text-success" },
    { label: "Total Score", value: stats.totalScore, icon: <Target size={18} />, color: "text-primary" },
    { label: "K/D Ratio", value: calculateKDRatio(stats.totalKills, stats.totalDeaths), icon: <Heart size={18} />, color: "text-accent-2" },
  ];

  return (
    <FadeIn>
      {/* Hero Banner */}
      <div className="relative rounded-xl bg-gradient-to-r from-surface via-surface-2 to-surface border border-border/30 overflow-hidden mb-6">
        <div className="absolute inset-0 particle-grid opacity-30" />
        <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            fallback={player.username}
            src={player.avatarUrl}
            size="xl"
            className="border-primary/50"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-heading font-bold text-text">
              {player.username}
            </h2>
            <p className="text-text-muted mt-1">{player.email}</p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <Badge variant={player.role === "ADMIN" ? "danger" : "gold"}>
                {player.role}
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Calendar size={12} />
                Joined {formatDate(player.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={s.label} hoverEffect={false}>
            <CardContent className="text-center py-5">
              <div className={`mx-auto w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center ${s.color} mb-2`}>
                {s.icon}
              </div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-heading">
                {s.label}
              </p>
              <p className="text-2xl font-heading font-bold text-text mt-1">
                {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </FadeIn>
  );
}
