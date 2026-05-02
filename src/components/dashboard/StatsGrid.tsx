"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Swords, Trophy, Crown } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on("change", (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{displayValue}</span>;
}

interface StatsGridProps {
  stats: {
    totalPlayers: number;
    activeMatches: number;
    ongoingTournaments: number;
    topScore: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items: StatItem[] = [
    {
      label: "Total Players",
      value: stats.totalPlayers,
      icon: <Users size={22} />,
      color: "text-accent",
    },
    {
      label: "Active Matches",
      value: stats.activeMatches,
      icon: <Swords size={22} />,
      color: "text-primary",
    },
    {
      label: "Tournaments",
      value: stats.ongoingTournaments,
      icon: <Trophy size={22} />,
      color: "text-success",
    },
    {
      label: "Top Score",
      value: stats.topScore,
      icon: <Crown size={22} />,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <Card hoverEffect={false} className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-surface-2 ${item.color}`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-heading">
                  {item.label}
                </p>
                <p className="text-2xl font-heading font-bold text-text mt-0.5">
                  <AnimatedNumber value={item.value} />
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
