import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const dbUser = await syncUser();
  return dbUser?.role === "ADMIN" ? dbUser : null;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }

  const { name, email, city, bio, specialisations, languages, experienceYears, hourlyRateINR, isAvailable } = body;

  // Create or reuse user record
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: {
      clerkId: `admin_created_${Date.now()}`,
      email,
      name,
      role: "CONSULTANT",
    },
  });

  // Fail if a consultant record already exists for this user
  const existing = await prisma.consultant.findUnique({ where: { userId: user.id } });
  if (existing) {
    return NextResponse.json({ error: "Consultant already exists for this email" }, { status: 409 });
  }

  const consultant = await prisma.consultant.create({
    data: {
      userId: user.id,
      city: city ?? null,
      bio: bio ?? null,
      specialisations: specialisations ?? [],
      languages: languages ?? [],
      experienceYears: experienceYears ?? 0,
      hourlyRateINR: hourlyRateINR ?? null,
      isAvailable: isAvailable ?? true,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(consultant, { status: 201 });
}
