import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

type Ctx = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const dbUser = await syncUser();
  return dbUser?.role === "ADMIN" ? dbUser : null;
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const {
    name, city, bio, specialisations, languages,
    experienceYears, hourlyRateINR, isAvailable,
  } = body;

  const consultant = await prisma.consultant.findUnique({
    where: { id },
    include: { user: { select: { id: true } } },
  });
  if (!consultant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update user name if provided
  if (name) {
    await prisma.user.update({
      where: { id: consultant.userId },
      data: { name },
    });
  }

  const updated = await prisma.consultant.update({
    where: { id },
    data: {
      city:            city !== undefined ? city : undefined,
      bio:             bio !== undefined ? bio : undefined,
      specialisations: specialisations ?? undefined,
      languages:       languages ?? undefined,
      experienceYears: experienceYears !== undefined ? Number(experienceYears) : undefined,
      hourlyRateINR:   hourlyRateINR !== undefined ? Number(hourlyRateINR) : undefined,
      isAvailable:     isAvailable !== undefined ? Boolean(isAvailable) : undefined,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const consultant = await prisma.consultant.findUnique({ where: { id } });
  if (!consultant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.consultant.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
