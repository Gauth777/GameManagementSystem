"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Player } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

interface PlayerCardProps {
  player: Player;
  index?: number;
}

export function PlayerCard({ player, index = 0 }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/players/${player.id}`}>
        <Card glowColor="gold" className="group cursor-pointer">
          <CardContent className="flex items-center gap-4">
            <Avatar
              fallback={player.username}
              src={player.avatarUrl}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-text group-hover:text-primary transition-colors truncate">
                {player.username}
              </h3>
              <p className="text-xs text-text-muted truncate">{player.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={player.role === "ADMIN" ? "danger" : "outline"}>
                  {player.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
