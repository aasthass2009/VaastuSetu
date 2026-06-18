import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const dbUser = await syncUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, phone, city, country, preferredLanguage } = body as {
    name?: string;
    phone?: string;
    city?: string;
    country?: string;
    preferredLanguage?: string;
  };

  const updated = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      name:              name?.trim()              || null,
      phone:             phone?.trim()             || null,
      city:              city?.trim()              || null,
      country:           country?.trim()           || null,
      preferredLanguage: preferredLanguage?.trim() || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      country: true,
      preferredLanguage: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}
