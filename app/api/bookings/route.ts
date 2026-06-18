import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

const COMMISSION_PCT = 0.2;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { consultantId, scheduledAt, clientName, clientEmail, notes } = body as {
    consultantId: string;
    scheduledAt: string;
    clientName: string;
    clientEmail: string;
    notes?: string;
  };

  if (!consultantId || !scheduledAt || !clientName || !clientEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Auth — user must be signed in to book
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Sign in to book a consultation" }, { status: 401 });
  }

  const dbUser = await syncUser();
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  // Validate consultant exists
  const consultant = await prisma.consultant.findUnique({
    where: { id: consultantId },
    include: { user: { select: { name: true } } },
  });
  if (!consultant || !consultant.isAvailable) {
    return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
  }

  // Validate scheduled time is in the future
  const scheduledDate = new Date(scheduledAt);
  if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
    return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 });
  }

  const rateINR = consultant.hourlyRateINR ?? 0;
  const amountPaise = rateINR * 100;
  const commissionPaise = Math.round(amountPaise * COMMISSION_PCT);
  const consultantPayoutPaise = amountPaise - commissionPaise;

  // Create Order (pending payment) + Booking atomically
  const [order, booking] = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        userId: dbUser.id,
        amountPaise,
        description: `Vastu consultation with ${consultant.user.name}`,
        metadata: {
          type: "consultation",
          consultantId: consultant.id,
          commissionPct: COMMISSION_PCT * 100,
          platformCommissionPaise: commissionPaise,
          consultantPayoutPaise,
          clientName,
          clientEmail,
        },
      },
    });

    const b = await tx.booking.create({
      data: {
        userId: dbUser.id,
        consultantId: consultant.id,
        scheduledAt: scheduledDate,
        durationMins: 60,
        status: "PENDING",
        notesClient: notes,
        orderId: o.id,
      },
    });

    return [o, b];
  });

  return NextResponse.json({
    bookingId: booking.id,
    orderId: order.id,
    scheduledAt: booking.scheduledAt.toISOString(),
    consultantName: consultant.user.name,
    amountINR: rateINR,
    commissionINR: commissionPaise / 100,
    status: booking.status,
  });
}
