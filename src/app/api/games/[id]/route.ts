import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, name: true, genre: true, releaseDate: true, companyId: true, createdAt: true,
        company: { select: { id: true, name: true, headquarters: true } },
        gameModes: { select: { id: true, name: true, description: true, gameId: true } },
        characters: { select: { id: true, name: true, role: true, imageUrl: true } },
        teams: { select: { id: true, name: true, logoUrl: true } },
      },
    });
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
    return NextResponse.json(game);
  } catch {
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const game = await prisma.game.update({
      where: { id: Number(params.id) },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.genre && { genre: body.genre }),
        ...(body.releaseDate && { releaseDate: new Date(body.releaseDate) }),
        ...(body.companyId && { companyId: body.companyId }),
      },
    });
    return NextResponse.json(game);
  } catch {
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.game.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}
