import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { Button } from "@/components/ui/button";
import { ScoreDial } from "@/components/vaastu/score-dial";
import type { Verdict } from "@/components/vaastu/score-dial";

type RoomFinding = {
  room: string;
  label: string;
  direction: string;
  tier: "ideal" | "okay" | "neutral" | "avoid";
  points: number;
  remedy: string;
};

const TIER_PILL: Record<RoomFinding["tier"], string> = {
  ideal:   "bg-green-100 text-green-800",
  okay:    "bg-amber-100 text-amber-800",
  neutral: "bg-slate-100 text-slate-600",
  avoid:   "bg-red-100 text-red-800",
};
const TIER_LABEL: Record<RoomFinding["tier"], string> = {
  ideal:   "✦ Ideal",
  okay:    "~ Acceptable",
  neutral: "— Neutral",
  avoid:   "⚠ Needs attention",
};

function getVerdict(score: number): Verdict {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const [{ userId }, { a, b }] = await Promise.all([auth(), searchParams]);
  if (!userId) redirect("/sign-in");
  if (!a || !b || a === b) redirect("/homes");

  const dbUser = await syncUser();
  if (!dbUser) redirect("/sign-in");

  const [homeA, homeB] = await Promise.all([
    prisma.home.findFirst({
      where: { id: a, userId: dbUser.id },
      include: { reports: { orderBy: { generatedAt: "desc" }, take: 1 } },
    }),
    prisma.home.findFirst({
      where: { id: b, userId: dbUser.id },
      include: { reports: { orderBy: { generatedAt: "desc" }, take: 1 } },
    }),
  ]);
  if (!homeA || !homeB) redirect("/homes");

  const findingsA = (homeA.reports[0]?.findings ?? []) as RoomFinding[];
  const findingsB = (homeB.reports[0]?.findings ?? []) as RoomFinding[];
  const verdictA = homeA.vaastuScore !== null ? getVerdict(homeA.vaastuScore) : null;
  const verdictB = homeB.vaastuScore !== null ? getVerdict(homeB.vaastuScore) : null;

  // Merge rooms from both homes by room key
  const roomMap = new Map<string, { label: string; a?: RoomFinding; b?: RoomFinding }>();
  for (const f of findingsA) roomMap.set(f.room, { label: f.label, a: f });
  for (const f of findingsB) {
    const entry = roomMap.get(f.room);
    if (entry) entry.b = f;
    else roomMap.set(f.room, { label: f.label, b: f });
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-cream-200 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Button
          asChild
          variant="link"
          className="mb-6 h-auto p-0 font-body text-sm text-brand-saffron"
        >
          <Link href="/homes">← My Homes</Link>
        </Button>

        <div className="mb-8 text-center">
          <p className="font-body text-sm font-medium uppercase tracking-widest text-brand-saffron">
            Side-by-Side
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-brand-indigo md:text-4xl">
            {homeA.label}{" "}
            <span className="text-brand-gold">vs</span>{" "}
            {homeB.label}
          </h1>
        </div>

        {/* Score dials */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {([
            { home: homeA, verdict: verdictA },
            { home: homeB, verdict: verdictB },
          ] as const).map(({ home, verdict: v }) => (
            <div
              key={home.id}
              className="flex flex-col items-center rounded-2xl border border-cream-300 bg-white py-8 px-4"
            >
              <p className="mb-4 font-heading text-lg font-semibold text-brand-indigo">
                {home.label}
              </p>
              {home.vaastuScore !== null && v ? (
                <ScoreDial score={home.vaastuScore} verdict={v} />
              ) : (
                <p className="font-body text-sm text-indigo-400">No score</p>
              )}
            </div>
          ))}
        </div>

        {/* Room comparison table */}
        {roomMap.size > 0 && (
          <>
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-cream-300" />
              <span className="font-heading text-lg text-brand-gold">✦</span>
              <div className="h-px flex-1 bg-cream-300" />
            </div>

            <h2 className="mb-4 font-heading text-xl font-semibold text-brand-indigo">
              Room-by-Room Comparison
            </h2>

            <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white">
              {/* Header row */}
              <div className="grid grid-cols-3 border-b border-cream-300 bg-cream-100 px-4 py-3">
                <span className="font-body text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Room
                </span>
                <span className="text-center font-body text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {homeA.label}
                </span>
                <span className="text-center font-body text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {homeB.label}
                </span>
              </div>

              {Array.from(roomMap.entries()).map(([room, { label, a: rA, b: rB }]) => {
                const differs = rA && rB && rA.tier !== rB.tier;
                return (
                  <div
                    key={room}
                    className={`grid grid-cols-3 items-center border-b border-cream-300/60 px-4 py-3 last:border-0 ${differs ? "bg-saffron-50/40" : ""}`}
                  >
                    <span className="font-body text-sm font-medium text-brand-indigo">
                      {label}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      {rA ? (
                        <>
                          <span className={`rounded-full px-2 py-0.5 font-body text-xs font-semibold ${TIER_PILL[rA.tier]}`}>
                            {TIER_LABEL[rA.tier]}
                          </span>
                          <span className="font-body text-xs text-indigo-400">
                            {rA.direction}
                          </span>
                        </>
                      ) : (
                        <span className="font-body text-xs text-indigo-300">—</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {rB ? (
                        <>
                          <span className={`rounded-full px-2 py-0.5 font-body text-xs font-semibold ${TIER_PILL[rB.tier]}`}>
                            {TIER_LABEL[rB.tier]}
                          </span>
                          <span className="font-body text-xs text-indigo-400">
                            {rB.direction}
                          </span>
                        </>
                      ) : (
                        <span className="font-body text-xs text-indigo-300">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 font-body text-xs text-indigo-400">
              Rows with a tinted background indicate rooms where the two homes differ in tier.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
