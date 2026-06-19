import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { generateVaastuPDF } from "@/lib/pdf/report";
import type { RoomFinding } from "@/lib/pdf/report";

type Ctx = { params: Promise<{ id: string }> };

function getVerdict(score: number): "Excellent" | "Good" | "Fair" | "Poor" {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

async function hasReportAccess(userId: string, homeId: string): Promise<boolean> {
  const [subscription, paidOrder] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.order.findFirst({
      where: { userId, type: "REPORT_UNLOCK", homeId, status: "PAID" },
    }),
  ]);

  const isPro =
    subscription?.plan === "PRO" &&
    subscription?.status === "ACTIVE" &&
    subscription.currentPeriodEnd != null &&
    new Date(subscription.currentPeriodEnd) > new Date();

  return isPro || paidOrder !== null;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const [{ userId }, { id }] = await Promise.all([auth(), params]);
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const dbUser = await syncUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const home = await prisma.home.findFirst({
    where: { id, userId: dbUser.id },
    include: { reports: { orderBy: { generatedAt: "desc" }, take: 1 } },
  });
  if (!home) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (home.vaastuScore === null)
    return NextResponse.json({ error: "No score to generate a report for" }, { status: 400 });

  // Paywall — must have paid for this report or have an active Pro subscription
  const canDownload = await hasReportAccess(dbUser.id, id);
  if (!canDownload) {
    return NextResponse.json(
      { error: "Payment required", code: "PAYMENT_REQUIRED" },
      { status: 402 }
    );
  }

  const findings = (home.reports[0]?.findings ?? []) as RoomFinding[];
  const verdict  = getVerdict(home.vaastuScore);
  const scoredDate = new Date(home.scoredAt ?? home.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const pdfBuffer = await generateVaastuPDF({
    homeLabel: home.label,
    scoredAt:  scoredDate,
    score:     home.vaastuScore,
    verdict,
    findings,
  });

  if (home.reports[0]) {
    await prisma.report.update({
      where: { id: home.reports[0].id },
      data:  { pdfUrl: "generated" },
    });
  } else {
    await prisma.report.create({
      data: {
        homeId:  home.id,
        title:   `${home.label} — Vastu Score Report`,
        findings: findings as object[],
        summary: `Score: ${Math.round(home.vaastuScore)}/100 · Verdict: ${verdict}`,
        pdfUrl:  "generated",
      },
    });
  }

  const slug     = home.label.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const filename = `vaastusetu-report-${slug}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control":       "no-store",
    },
  });
}
