import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ hasAccess: false, reason: "unauthenticated" });

  const dbUser = await syncUser();
  if (!dbUser) return NextResponse.json({ hasAccess: false, reason: "user_not_found" });

  const homeId = req.nextUrl.searchParams.get("homeId");
  if (!homeId) return NextResponse.json({ error: "homeId required" }, { status: 400 });

  let subscription, paidOrder;
  try {
    [subscription, paidOrder] = await Promise.all([
      prisma.subscription.findUnique({ where: { userId: dbUser.id } }),
      prisma.order.findFirst({
        where: { userId: dbUser.id, type: "REPORT_UNLOCK", homeId, status: "PAID" },
      }),
    ]);
  } catch (err) {
    console.error("[payments/access] DB query failed:", err);
    return NextResponse.json({ error: "Failed to check access" }, { status: 500 });
  }

  // Cancelled subs retain access until currentPeriodEnd (already paid)
  const isPro =
    subscription?.plan === "PRO" &&
    (subscription.status === "ACTIVE" || subscription.status === "CANCELLED") &&
    subscription.currentPeriodEnd != null &&
    new Date(subscription.currentPeriodEnd) > new Date();

  if (isPro) {
    return NextResponse.json({
      hasAccess: true,
      reason: "pro_subscription",
      plan: "PRO",
      periodEnd: subscription!.currentPeriodEnd,
    });
  }

  if (paidOrder) {
    return NextResponse.json({ hasAccess: true, reason: "report_purchased" });
  }

  return NextResponse.json({ hasAccess: false, reason: "no_access" });
}
