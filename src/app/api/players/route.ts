import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { playerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = Number(searchParams.get("limit")) || 50;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        select: { id: true, username: true, email: true, role: true, joinDate: true, avatarUrl: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.player.count({ where }),
    ]);

    return NextResponse.json({ data: players, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = playerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const existing = await prisma.player.findFirst({
      where: { OR: [{ email: parsed.data.email }, { username: parsed.data.username }] },
    });
    if (existing) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password || "Player@123", 10);
    const player = await prisma.player.create({
      data: {
        username: parsed.data.username,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role || "PLAYER",
        avatarUrl: parsed.data.avatarUrl || null,
      },
      select: { id: true, username: true, email: true, role: true, joinDate: true, avatarUrl: true },
    });

    return NextResponse.json(player, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}
