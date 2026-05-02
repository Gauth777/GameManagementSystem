import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamSchema } from "@/lib/validations";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      select: { id: true, name: true, gameId: true, createdDate: true, logoUrl: true, game: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: teams });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = teamSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const team = await prisma.team.create({ data: { name: parsed.data.name, gameId: parsed.data.gameId, logoUrl: parsed.data.logoUrl || null } });
    return NextResponse.json(team, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
