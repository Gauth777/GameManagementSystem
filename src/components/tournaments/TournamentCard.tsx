"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Tournament } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Calendar, DollarSign } from "lucide-react";
import { GlowPulse } from "@/components/animations/GlowPulse";

interface TournamentCardProps {
  tournament: Tournament;
  index?: number;
}

const statusConfig = {
  UPCOMING: { variant: "default" as const, label: "Upcoming" },
  ONGOING: { variant: "success" as const, label: "Live" },
  COMPLETED: { variant: "outline" as const, label: "Completed" },
};

export function TournamentCard({ tournament, index = 0 }: TournamentCardProps) {
  const status = statusConfig[tournament.status];
  const isOngoing = tournament.status === "ONGOING";

  const CardWrapper = isOngoing ? GlowPulse : React.Fragment;
  const wrapperProps = isOngoing
    ? { color: "gold" as const, className: "rounded-xl" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <Link href={`/tournaments/${tournament.id}`}>
        <CardWrapper {...wrapperProps}>
          <Card glowColor="gold" className="group cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Crown size={22} className="text-primary" />
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <h3 className="font-heading text-lg font-bold text-text group-hover:text-primary transition-colors">
                {tournament.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-lg font-heading font-bold text-primary">
                <DollarSign size={16} />
                {formatCurrency(Number(tournament.prizePool))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(tournament.startDate)}
              </span>
              <span>→ {formatDate(tournament.endDate)}</span>
            </CardFooter>
          </Card>
        </CardWrapper>
      </Link>
    </motion.div>
  );
}
