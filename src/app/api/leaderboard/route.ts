import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 50;

    const statsGrouped = await prisma.playerStats.groupBy({
      by: ["playerId"],
      _sum: { score: true, kills: true, deaths: true, assists: true },
      _count: { id: true },
      orderBy: { _sum: { score: "desc" } },
      take: limit,
    });

    const playerIds = statsGrouped.map((s) => s.playerId);

    const players = await prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, username: true, avatarUrl: true },
    });

    const winCounts = await prisma.matchParticipation.groupBy({
      by: ["playerId"],
      where: { playerId: { in: playerIds }, result: "WIN" },
      _count: { id: true },
    });

    const playerMap = new Map(players.map((p) => [p.id, p]));
    const winMap = new Map(winCounts.map((w) => [w.playerId, w._count.id]));

    const entries = statsGrouped.map((s, i) => {
      const player = playerMap.get(s.playerId);
      const wins = winMap.get(s.playerId) || 0;
      const kills = s._sum.kills || 0;
      const deaths = s._sum.deaths || 0;
      return {
        rank: i + 1,
        id: s.playerId,
        username: player?.username || "Unknown",
        avatarUrl: player?.avatarUrl || null,
        totalScore: s._sum.score || 0,
        wins,
        totalMatches: s._count.id,
        kills,
        deaths,
        kdRatio: deaths === 0 ? kills : Number((kills / deaths).toFixed(2)),
      };
    });

    return NextResponse.json({ data: entries });
  } catch {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
