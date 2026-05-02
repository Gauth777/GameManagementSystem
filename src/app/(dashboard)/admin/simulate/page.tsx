"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { useToast } from "@/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Swords, Trophy, ChevronDown } from "lucide-react";
import type { Game, GameMode, Team } from "@/types";

export default function SimulatePage() {
  const toast = useToast();
  const [games, setGames] = useState<Game[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/games").then((r) => r.json()).then((d) => setGames(Array.isArray(d) ? d : d.data || []));
    fetch("/api/teams").then((r) => r.json()).then((d) => setTeams(Array.isArray(d) ? d : d.data || []));
  }, []);

  useEffect(() => {
    if (selectedGame) {
      const game = games.find((g) => g.id === Number(selectedGame));
      setGameModes(game?.gameModes || []);
      setSelectedMode("");
    }
  }, [selectedGame, games]);

  const handleSimulate = async () => {
    if (!selectedMode || !team1 || !team2 || team1 === team2) {
      toast.error("Select a game mode and two different teams");
      return;
    }
    setSimulating(true);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameModeId: Number(selectedMode), team1Id: Number(team1), team2Id: Number(team2) }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast.success("Match simulated!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Simulation failed");
      }
    } catch { toast.error("Simulation failed"); }
    setSimulating(false);
  };

  const selectClass = "w-full bg-surface-2 border border-border/60 rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none";

  return (
    <div className="space-y-6">
      <PageHeader title="Match Simulation" description="Simulate a match between two teams" />
      <FadeIn>
        <Card hoverEffect={false}>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-muted uppercase tracking-wider">Game</label>
                <div className="relative">
                  <select className={selectClass} value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                    <option value="">Select game</option>
                    {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-muted uppercase tracking-wider">Game Mode</label>
                <div className="relative">
                  <select className={selectClass} value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)} disabled={!selectedGame}>
                    <option value="">Select mode</option>
                    {gameModes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-muted uppercase tracking-wider">Team 1</label>
                <div className="relative">
                  <select className={selectClass} value={team1} onChange={(e) => setTeam1(e.target.value)}>
                    <option value="">Select team</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-muted uppercase tracking-wider">Team 2</label>
                <div className="relative">
                  <select className={selectClass} value={team2} onChange={(e) => setTeam2(e.target.value)}>
                    <option value="">Select team</option>
                    {teams.filter((t) => String(t.id) !== team1).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
            <Button onClick={handleSimulate} isLoading={simulating} className="w-full sm:w-auto" size="lg">
              <Zap size={16} /> Simulate Match
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <Card hoverEffect={false} className="border-primary/30 glow-border-gold">
              <CardContent className="text-center py-8">
                <Trophy size={40} className="mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-heading font-bold text-text mb-2">Match Complete!</h2>
                <p className="text-lg text-primary font-heading font-bold">
                  Winner: {(result as Record<string, unknown>).winner as string}
                </p>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-text-muted">Team 1 Score</p>
                    <p className="text-xl font-heading font-bold text-accent">
                      {((result as Record<string, Record<string, unknown>>).team1?.totalScore as number) || 0}
                    </p>
                  </div>
                  <Swords size={24} className="text-text-muted" />
                  <div className="text-center">
                    <p className="text-sm text-text-muted">Team 2 Score</p>
                    <p className="text-xl font-heading font-bold text-accent-2">
                      {((result as Record<string, Record<string, unknown>>).team2?.totalScore as number) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
