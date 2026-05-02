import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tournamentSchema } from "@/lib/validations";

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      select: { id: true, name: true, startDate: true, endDate: true, prizePool: true, status: true, createdAt: true, _count: { select: { matches: true } } },
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json({ data: tournaments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = tournamentSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const tournament = await prisma.tournament.create({
      data: { name: parsed.data.name, startDate: new Date(parsed.data.startDate), endDate: new Date(parsed.data.endDate), prizePool: parsed.data.prizePool, status: parsed.data.status || "UPCOMING" },
    });
    return NextResponse.json(tournament, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}
