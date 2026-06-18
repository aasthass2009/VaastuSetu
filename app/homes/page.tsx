import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { Button } from "@/components/ui/button";
import { HomesClient } from "./_components/homes-client";

export default async function HomesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser) redirect("/sign-in");

  const homes = await prisma.home.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      vaastuScore: true,
      scoredAt: true,
      createdAt: true,
      plotFacing: true,
    },
  });

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-cream-200 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-body text-sm font-medium uppercase tracking-widest text-brand-saffron">
              Your Portfolio
            </p>
            <h1 className="mt-1 font-heading text-4xl font-semibold text-brand-indigo md:text-5xl">
              My Homes
            </h1>
            <p className="mt-2 font-body text-base text-indigo-600">
              {homes.length === 0
                ? "No saved homes yet."
                : `${homes.length} saved propert${homes.length === 1 ? "y" : "ies"}`}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-brand-saffron text-cream-200 hover:bg-saffron-600"
          >
            <Link href="/vaastu-score">+ New Score</Link>
          </Button>
        </div>

        <HomesClient
          homes={homes.map((h) => ({
            ...h,
            scoredAt: h.scoredAt?.toISOString() ?? null,
            createdAt: h.createdAt.toISOString(),
            plotFacing: h.plotFacing ?? null,
          }))}
        />
      </div>
    </div>
  );
}
