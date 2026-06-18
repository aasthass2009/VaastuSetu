import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = (await req.json()) as {
    label?: string;
    vaastuScore: number;
    rooms: unknown;
  };

  const dbUser = await syncUser();
  if (!dbUser)
    return NextResponse.json({ error: "Could not resolve user" }, { status: 400 });

  const home = await prisma.home.create({
    data: {
      userId: dbUser.id,
      label: body.label?.trim() || "My Home",
      vaastuScore: body.vaastuScore,
      scoredAt: new Date(),
      reports: {
        create: {
          title: "Vastu Score Report",
          findings: body.rooms as object,
        },
      },
    },
  });

  return NextResponse.json({ id: home.id });
}
