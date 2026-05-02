import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { simulateSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = simulateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { gameModeId, team1Id, team2Id } = parsed.data;

    // Get players for each team (use recent participants or fallback to random players)
    const team1Players = await prisma.player.findMany({ take: 5, orderBy: { id: "asc" } });
    const team2Players = await prisma.player.findMany({ take: 5, skip: 5, orderBy: { id: "asc" } });

    if (team1Players.length < 5 || team2Players.length < 5) {
      return NextResponse.json({ error: "Not enough players for simulation" }, { status: 400 });
    }

    // Generate random stats
    const genScore = () => Math.floor(Math.random() * 35) + 5;
    const genKills = () => Math.floor(Math.random() * 25) + 1;
    const genDeaths = () => Math.floor(Math.random() * 15) + 1;
    const genAssists = () => Math.floor(Math.random() * 20);

    let team1Total = 0;
    let team2Total = 0;

    const team1Stats = team1Players.map((p) => {
      const score = genScore();
      team1Total += score;
      return { playerId: p.id, score, kills: genKills(), deaths: genDeaths(), assists: genAssists() };
    });

    const team2Stats = team2Players.map((p) => {
      const score = genScore();
      team2Total += score;
      return { playerId: p.id, score, kills: genKills(), deaths: genDeaths(), assists: genAssists() };
    });

    const team1Wins = team1Total >= team2Total;

    // Transaction: create match + participations + stats
    const result = await prisma.$transaction(async (tx) => {
      const match = await tx.match.create({
        data: { matchDate: new Date(), matchType: "Ranked", gameModeId },
      });

      // Team 1 participations and stats
      for (const s of team1Stats) {
        await tx.matchParticipation.create({
          data: { matchId: match.id, teamId: team1Id, playerId: s.playerId, result: team1Wins ? "WIN" : "LOSS" },
        });
        await tx.playerStats.create({
          data: { playerId: s.playerId, matchId: match.id, score: s.score, kills: s.kills, deaths: s.deaths, assists: s.assists },
        });
      }

      // Team 2 participations and stats
      for (const s of team2Stats) {
        await tx.matchParticipation.create({
          data: { matchId: match.id, teamId: team2Id, playerId: s.playerId, result: team1Wins ? "LOSS" : "WIN" },
        });
        await tx.playerStats.create({
          data: { playerId: s.playerId, matchId: match.id, score: s.score, kills: s.kills, deaths: s.deaths, assists: s.assists },
        });
      }

      return match;
    });

    const team1Info = await prisma.team.findUnique({ where: { id: team1Id }, select: { name: true } });
    const team2Info = await prisma.team.findUnique({ where: { id: team2Id }, select: { name: true } });

    return NextResponse.json({
      match: result,
      team1: { team: team1Info, totalScore: team1Total },
      team2: { team: team2Info, totalScore: team2Total },
      winner: team1Wins ? team1Info?.name : team2Info?.name,
    });
  } catch {
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
