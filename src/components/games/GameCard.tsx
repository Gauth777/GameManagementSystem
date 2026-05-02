"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Game } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Calendar, Building2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  index?: number;
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/games/${game.id}`}>
        <Card glowColor="gold" className="group cursor-pointer h-full">
          <CardContent className="pt-6">
            <div className="w-14 h-14 rounded-xl bg-gold-gradient/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
              <Gamepad2 size={24} className="text-primary" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default">{game.genre}</Badge>
              {game.gameModes && (
                <Badge variant="outline">{game.gameModes.length} modes</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Building2 size={12} />
              {game.company?.name || "Unknown"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(game.releaseDate)}
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
