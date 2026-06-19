import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const dbUser = await syncUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({ where: { userId: dbUser.id } });

  if (!sub || sub.plan !== "PRO" || sub.status !== "ACTIVE") {
    return NextResponse.json({ error: "No active Pro subscription found" }, { status: 400 });
  }

  await prisma.subscription.update({
    where: { userId: dbUser.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  return NextResponse.json({ success: true, accessUntil: sub.currentPeriodEnd });
}
