import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { razorpay } from "@/lib/razorpay";

const REPORT_UNLOCK_PAISE = 49900; // ₹499
const SUBSCRIPTION_PAISE  = 29900; // ₹299/month

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const dbUser = await syncUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { type, homeId } = body as { type: string; homeId?: string };

  if (type !== "REPORT_UNLOCK" && type !== "SUBSCRIPTION") {
    return NextResponse.json({ error: "Invalid order type" }, { status: 400 });
  }

  if (type === "REPORT_UNLOCK") {
    if (!homeId) return NextResponse.json({ error: "homeId required" }, { status: 400 });
    const home = await prisma.home.findFirst({ where: { id: homeId, userId: dbUser.id } });
    if (!home) return NextResponse.json({ error: "Home not found" }, { status: 404 });

    const existing = await prisma.order.findFirst({
      where: { userId: dbUser.id, type: "REPORT_UNLOCK", homeId, status: "PAID" },
    });
    if (existing) return NextResponse.json({ error: "Already purchased" }, { status: 409 });
  }

  const amountPaise = type === "REPORT_UNLOCK" ? REPORT_UNLOCK_PAISE : SUBSCRIPTION_PAISE;
  const description = type === "REPORT_UNLOCK"
    ? "Full Vastu Report — one-time unlock"
    : "VaastuSetu Pro — 1 month";

  // Create the Razorpay order first, then record it in DB
  let rzpOrderId: string;
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      notes: { type, homeId: homeId ?? "", userId: dbUser.id },
    });
    rzpOrderId = rzpOrder.id;
  } catch (err) {
    console.error("[payments/order] Razorpay create order failed:", err);
    return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 502 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        amountPaise,
        description,
        razorpayOrderId: rzpOrderId,
        type: type as "REPORT_UNLOCK" | "SUBSCRIPTION",
        homeId: homeId ?? null,
      },
    });

    return NextResponse.json({
      razorpayOrderId: rzpOrderId,
      amount: amountPaise,
      currency: "INR",
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      description,
    });
  } catch (err) {
    console.error("[payments/order] DB create order failed:", err);
    return NextResponse.json({ error: "Failed to save order. Please try again." }, { status: 500 });
  }
}
