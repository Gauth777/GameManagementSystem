import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gameSchema } from "@/lib/validations";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true, name: true, genre: true, releaseDate: true, companyId: true, createdAt: true,
        company: { select: { id: true, name: true } },
        gameModes: { select: { id: true, name: true, description: true } },
        _count: { select: { characters: true, teams: true, gameAccounts: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: games });
  } catch {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = gameSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const game = await prisma.game.create({
      data: { name: parsed.data.name, genre: parsed.data.genre, releaseDate: new Date(parsed.data.releaseDate), companyId: parsed.data.companyId },
    });
    return NextResponse.json(game, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
