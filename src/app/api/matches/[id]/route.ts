import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, matchDate: true, matchType: true, gameModeId: true, tournamentId: true, createdAt: true,
        gameMode: { select: { id: true, name: true, game: { select: { id: true, name: true } } } },
        tournament: { select: { id: true, name: true } },
        participations: { select: { id: true, matchId: true, playerId: true, teamId: true, result: true, team: { select: { id: true, name: true } }, player: { select: { id: true, username: true, avatarUrl: true } } } },
        playerStats: { select: { id: true, playerId: true, matchId: true, score: true, kills: true, deaths: true, assists: true } },
      },
    });
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    return NextResponse.json(match);
  } catch {
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const match = await prisma.match.update({ where: { id: Number(params.id) }, data: body });
    return NextResponse.json(match);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.match.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
