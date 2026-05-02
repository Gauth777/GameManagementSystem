import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalPlayers, activeMatches, ongoingTournaments, topScoreResult] = await Promise.all([
      prisma.player.count(),
      prisma.match.count(),
      prisma.tournament.count({ where: { status: "ONGOING" } }),
      prisma.playerStats.aggregate({ _max: { score: true } }),
    ]);

    return NextResponse.json({
      totalPlayers,
      activeMatches,
      ongoingTournaments,
      topScore: topScoreResult._max.score || 0,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
