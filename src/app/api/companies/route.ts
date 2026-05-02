import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/lib/validations";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: { id: true, name: true, headquarters: true, foundedYear: true, createdAt: true, _count: { select: { games: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: companies });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const company = await prisma.company.create({ data: parsed.data });
    return NextResponse.json(company, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
