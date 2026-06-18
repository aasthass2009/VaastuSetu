import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

type Ctx = { params: Promise<{ id: string }> };

async function getDbUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return syncUser();
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const [dbUser, { id }] = await Promise.all([getDbUser(), params]);
  if (!dbUser) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const home = await prisma.home.findFirst({
    where: { id, userId: dbUser.id },
    include: { reports: { orderBy: { generatedAt: "desc" }, take: 1 } },
  });
  if (!home) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(home);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const [dbUser, { id }] = await Promise.all([getDbUser(), params]);
  if (!dbUser) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { label } = (await req.json()) as { label: string };
  if (!label?.trim())
    return NextResponse.json({ error: "Label required" }, { status: 400 });

  const result = await prisma.home.updateMany({
    where: { id, userId: dbUser.id },
    data: { label: label.trim() },
  });
  if (result.count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const [dbUser, { id }] = await Promise.all([getDbUser(), params]);
  if (!dbUser) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const result = await prisma.home.deleteMany({
    where: { id, userId: dbUser.id },
  });
  if (result.count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
