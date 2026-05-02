import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, name: true, gameId: true, createdDate: true, logoUrl: true,
        game: { select: { id: true, name: true, genre: true } },
        participations: { select: { id: true, matchId: true, result: true, playerId: true, player: { select: { id: true, username: true, avatarUrl: true, role: true } } } },
      },
    });
    if (!team) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(team);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const team = await prisma.team.update({ where: { id: Number(params.id) }, data: body });
    return NextResponse.json(team);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.team.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
