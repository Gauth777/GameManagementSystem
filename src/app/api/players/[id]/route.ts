import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, username: true, email: true, role: true, joinDate: true, avatarUrl: true, createdAt: true,
        gameAccounts: { select: { id: true, accountLevel: true, createdDate: true, game: { select: { id: true, name: true, genre: true } } } },
        stats: { select: { id: true, matchId: true, score: true, kills: true, deaths: true, assists: true }, orderBy: { id: "desc" } },
        matchParticipations: { select: { id: true, matchId: true, result: true, team: { select: { id: true, name: true } } }, orderBy: { id: "desc" } },
      },
    });
    if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });
    return NextResponse.json(player);
  } catch {
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const player = await prisma.player.update({
      where: { id: Number(params.id) },
      data: {
        ...(body.username && { username: body.username }),
        ...(body.email && { email: body.email }),
        ...(body.role && { role: body.role }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
      },
      select: { id: true, username: true, email: true, role: true },
    });
    return NextResponse.json(player);
  } catch {
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.player.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
