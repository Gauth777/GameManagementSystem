import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const matches = await prisma.match.findMany({
      select: {
        id: true, matchDate: true, matchType: true, gameModeId: true, tournamentId: true, createdAt: true,
        gameMode: { select: { id: true, name: true, game: { select: { id: true, name: true } } } },
        tournament: { select: { id: true, name: true } },
        participations: { select: { id: true, result: true, team: { select: { id: true, name: true } }, player: { select: { id: true, username: true } } } },
      },
      orderBy: { matchDate: "desc" },
      take: limit,
    });
    return NextResponse.json({ data: matches });
  } catch {
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const match = await prisma.match.create({
      data: {
        matchDate: new Date(body.matchDate),
        matchType: body.matchType,
        gameModeId: body.gameModeId,
        tournamentId: body.tournamentId || null,
      },
    });
    return NextResponse.json(match, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }
}
