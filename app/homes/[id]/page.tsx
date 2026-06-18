import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
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
  ideal:   "bg-green-100 text-green-800 border border-green-200",
  okay:    "bg-amber-100 text-amber-800 border border-amber-200",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
  avoid:   "bg-red-100 text-red-800 border border-red-200",
};
const TIER_LABEL: Record<RoomFinding["tier"], string> = {
  ideal:   "✦ Ideal",
  okay:    "~ Acceptable",
  neutral: "— Neutral",
  avoid:   "⚠ Needs attention",
};
const VERDICT_META: Record<Verdict, { bg: string; text: string; desc: string }> = {
  Excellent: { bg: "bg-green-50",  text: "text-green-800",  desc: "Outstanding Vastu alignment. Your home is set up to support well-being, prosperity, and peace." },
  Good:      { bg: "bg-amber-50",  text: "text-amber-800",  desc: "Good overall energy with a few rooms that can be improved with simple, non-structural remedies." },
  Fair:      { bg: "bg-orange-50", text: "text-orange-800", desc: "Several rooms are misaligned. Apply the remedies below to meaningfully improve your home's Vastu." },
  Poor:      { bg: "bg-red-50",    text: "text-red-800",    desc: "Significant Vastu imbalances detected. The remedies below can help neutralise negative energy." },
};

function getVerdict(score: number): Verdict {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export default async function HomeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ userId }, { id }] = await Promise.all([auth(), params]);
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser) redirect("/sign-in");

  const home = await prisma.home.findFirst({
    where: { id, userId: dbUser.id },
    include: { reports: { orderBy: { generatedAt: "desc" }, take: 1 } },
  });
  if (!home) notFound();

  const findings = ((home.reports[0]?.findings ?? []) as RoomFinding[]);
  const score = home.vaastuScore;
  const verdict = score !== null ? getVerdict(score) : null;

  const scoredDate = home.scoredAt
    ? new Date(home.scoredAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-cream-200 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back + heading */}
        <div className="mb-8">
          <Button
            asChild
            variant="link"
            className="mb-2 h-auto p-0 font-body text-sm text-brand-saffron"
          >
            <Link href="/homes">← My Homes</Link>
          </Button>
          <h1 className="font-heading text-3xl font-semibold text-brand-indigo md:text-4xl">
            {home.label}
          </h1>
          {scoredDate && (
            <p className="mt-1 font-body text-sm text-indigo-400">
              Scored on {scoredDate}
            </p>
          )}
        </div>

        {/* Score dial */}
        {score !== null && verdict ? (
          <>
            <div className="mb-6 flex flex-col items-center text-center">
              <ScoreDial score={score} verdict={verdict} />
              <div
                className={`mt-4 inline-block rounded-full px-5 py-2 font-body text-sm font-semibold ${VERDICT_META[verdict].bg} ${VERDICT_META[verdict].text}`}
              >
                {VERDICT_META[verdict].desc}
              </div>
            </div>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-cream-300" />
              <span className="font-heading text-lg text-brand-gold">✦</span>
              <div className="h-px flex-1 bg-cream-300" />
            </div>
          </>
        ) : (
          <div className="mb-8 rounded-xl border border-cream-300 bg-white p-6 text-center">
            <p className="font-body text-sm text-indigo-600">
              No score recorded for this home.
            </p>
          </div>
        )}

        {/* Room breakdown */}
        {findings.length > 0 && (
          <>
            <h2 className="mb-4 font-heading text-xl font-semibold text-brand-indigo">
              Room-by-Room Breakdown
            </h2>
            <div className="space-y-3">
              {findings.map((f) => (
                <div
                  key={f.room}
                  className="rounded-xl border border-cream-300 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="font-body text-sm font-semibold text-brand-indigo">
                        {f.label}
                      </span>
                      <span className="mx-2 text-indigo-300">·</span>
                      <span className="font-body text-sm text-indigo-600">
                        {f.direction}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-0.5 font-body text-xs font-semibold ${TIER_PILL[f.tier]}`}
                    >
                      {TIER_LABEL[f.tier]}
                    </span>
                    <span className="shrink-0 font-body text-xs text-indigo-400">
                      {f.points.toFixed(1)} pts
                    </span>
                  </div>
                  {f.remedy && (
                    <p className="mt-3 rounded-lg bg-cream-100 px-4 py-3 font-body text-sm leading-relaxed text-indigo-700">
                      {f.remedy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {score !== null && (
            <Button
              asChild
              className="bg-brand-saffron text-cream-200 hover:bg-saffron-600"
            >
              <a href={`/api/homes/${id}/report`} download>
                ↓ Download PDF Report
              </a>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200"
          >
            <Link href="/homes">← Back to My Homes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
