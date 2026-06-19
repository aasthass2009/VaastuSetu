import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const dbUser = await syncUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  // Verify HMAC-SHA256 signature — prevents fake payment notifications
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSig !== razorpaySignature) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
  });

  if (!order || order.userId !== dbUser.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ success: true, alreadyPaid: true });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID", razorpayPaymentId },
  });

  // Activate PRO subscription for 30 days
  if (order.type === "SUBSCRIPTION") {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelledAt: null,
      },
      create: {
        userId: dbUser.id,
        plan: "PRO",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });
  }

  return NextResponse.json({ success: true, type: order.type });
}
