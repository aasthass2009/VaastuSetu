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

const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as { status?: string };

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: body.status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}
