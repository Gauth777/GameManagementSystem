import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, name: true, startDate: true, endDate: true, prizePool: true, status: true, createdAt: true,
        matches: {
          select: {
            id: true, matchDate: true, matchType: true,
            gameMode: { select: { id: true, name: true, game: { select: { name: true } } } },
            participations: { select: { id: true, result: true, team: { select: { id: true, name: true } }, player: { select: { id: true, username: true } } } },
          },
          orderBy: { matchDate: "asc" },
        },
      },
    });
    if (!tournament) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tournament);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const t = await prisma.tournament.update({ where: { id: Number(params.id) }, data: body });
    return NextResponse.json(t);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.tournament.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
