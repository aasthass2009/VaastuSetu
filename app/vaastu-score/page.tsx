"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculate } from "@/lib/vaastu/engine";
import { DIRECTIONS, DIRECTION_LABELS, ROOM_CONFIGS } from "@/lib/vaastu/rules";
import type { Direction, RoomType, ScoreResult, ScoreTier } from "@/lib/vaastu/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROOM_ORDER: RoomType[] = [
  "entrance",
  "kitchen",
  "bedroom",
  "pooja",
  "toilet",
  "living",
];

const DEFAULT_SELECTIONS: Record<RoomType, Direction> = {
  entrance: "N",
  kitchen: "N",
  bedroom: "N",
  pooja: "N",
  toilet: "N",
  living: "N",
};

const TIER_PILL: Record<ScoreTier, string> = {
  ideal:   "bg-green-100 text-green-800 border border-green-200",
  okay:    "bg-amber-100 text-amber-800 border border-amber-200",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
  avoid:   "bg-red-100  text-red-800   border border-red-200",
};

const TIER_LABEL: Record<ScoreTier, string> = {
  ideal:   "✦ Ideal",
  okay:    "~ Acceptable",
  neutral: "— Neutral",
  avoid:   "⚠ Needs attention",
};

const VERDICT_META = {
  Excellent: { color: "#16a34a", bg: "bg-green-50",  text: "text-green-800",  desc: "Outstanding Vastu alignment. Your home is set up to support well-being, prosperity, and peace." },
  Good:      { color: "#d97706", bg: "bg-amber-50",  text: "text-amber-800",  desc: "Good overall energy with a few rooms that can be improved with simple, non-structural remedies." },
  Fair:      { color: "#ea580c", bg: "bg-orange-50", text: "text-orange-800", desc: "Several rooms are misaligned. Apply the remedies below to meaningfully improve your home's Vastu." },
  Poor:      { color: "#dc2626", bg: "bg-red-50",    text: "text-red-800",    desc: "Significant Vastu imbalances detected. The no-demolition remedies below can help neutralise negative energy." },
} as const;

// ─── Score Dial ──────────────────────────────────────────────────────────────

function ScoreDial({ score, verdict }: { score: number; verdict: keyof typeof VERDICT_META }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setDisplayed(0);
    const start = Date.now();
    const duration = 1200;
    function step() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const RADIUS = 80;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - displayed / 100);
  const strokeColor = VERDICT_META[verdict].color;

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 200 200"
      aria-label={`Vastu score: ${score} out of 100 — ${verdict}`}
    >
      {/* Background track */}
      <circle
        cx="100" cy="100" r={RADIUS}
        fill="none"
        stroke="#e8dfc8"
        strokeWidth="14"
      />
      {/* Progress arc */}
      <circle
        cx="100" cy="100" r={RADIUS}
        fill="none"
        stroke={strokeColor}
        strokeWidth="14"
        strokeDasharray={`${CIRC} ${CIRC}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dashoffset 0.05s linear" }}
      />
      {/* Score number */}
      <text
        x="100" y="88"
        textAnchor="middle"
        fontSize="48"
        fontWeight="700"
        fill="#241B3A"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        {displayed}
      </text>
      {/* /100 label */}
      <text
        x="100" y="110"
        textAnchor="middle"
        fontSize="13"
        fill="#6b6080"
        fontFamily="system-ui, sans-serif"
      >
        out of 100
      </text>
      {/* Verdict */}
      <text
        x="100" y="138"
        textAnchor="middle"
        fontSize="17"
        fontWeight="600"
        fill={strokeColor}
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        {verdict}
      </text>
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VaastuScorePage() {
  const { userId, isLoaded } = useAuth();
  const isSignedIn = isLoaded && !!userId;

  const [selections, setSelections] =
    useState<Record<RoomType, Direction>>(DEFAULT_SELECTIONS);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [expanded, setExpanded] = useState<Record<RoomType, boolean>>({
    entrance: false, kitchen: false, bedroom: false,
    pooja: false, toilet: false, living: false,
  });

  // Save state
  const [homeLabel, setHomeLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const inputs = ROOM_ORDER.map((room) => ({
      room,
      direction: selections[room],
    }));
    const r = calculate(inputs);
    setResult(r);
    setSavedId(null);
    setSaveError("");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/homes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: homeLabel.trim() || "My Home",
          vaastuScore: result.total,
          rooms: result.rooms.map((r) => ({
            room:      r.room,
            label:     r.label,
            direction: r.directionLabel,
            tier:      r.tier,
            points:    r.contribution,
            remedy:    r.remedy,
          })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as { id: string };
      setSavedId(data.id);
    } catch {
      setSaveError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function toggleRemedy(room: RoomType) {
    setExpanded((prev) => ({ ...prev, [room]: !prev[room] }));
  }

  return (
    <div className="bg-cream-200">
      {/* ── Page header ─────────────────────────────────────────── */}
      <section className="bg-brand-indigo px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            Core Feature
          </p>
          <h1 className="mb-5 font-heading text-5xl font-semibold text-cream-200 md:text-6xl">
            Your Vastu Score
          </h1>
          <p className="font-body text-lg leading-relaxed text-cream-300">
            Select the direction each room faces. We&apos;ll calculate a 0–100
            Vastu score and give you a tailored, no-demolition remedy for every
            imbalance we find.
          </p>
        </div>
      </section>

      {/* ── Input form ──────────────────────────────────────────── */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-brand-indigo">
            Which direction does each room face?
          </h2>
          <p className="mb-8 font-body text-sm text-indigo-600">
            Stand in the centre of the room and face outward — the direction you
            face is the room&apos;s facing direction.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {ROOM_ORDER.map((room) => {
              const cfg = ROOM_CONFIGS[room];
              return (
                <div
                  key={room}
                  className="rounded-xl border border-cream-300 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>{cfg.icon}</span>
                    <span className="font-body text-sm font-semibold text-brand-indigo">
                      {cfg.label}
                    </span>
                    <span className="ml-auto font-body text-xs text-indigo-400">
                      {cfg.weight} pts
                    </span>
                  </div>
                  <Select
                    value={selections[room]}
                    onValueChange={(val) =>
                      setSelections((prev) => ({ ...prev, [room]: val as Direction }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIRECTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {DIRECTION_LABELS[d]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleCalculate}
              className="min-w-[220px] bg-brand-saffron text-cream-200 hover:bg-saffron-600 text-base font-semibold"
            >
              Calculate My Vastu Score
            </Button>
          </div>
        </div>
      </section>

      {/* ── Results ─────────────────────────────────────────────── */}
      {result && (
        <section
          ref={resultsRef}
          className="border-t border-cream-300 bg-cream-200 px-6 pb-20 pt-12"
        >
          <div className="mx-auto max-w-3xl">

            {/* Score dial */}
            <div className="mb-6 flex flex-col items-center text-center">
              <ScoreDial score={result.total} verdict={result.verdict} />
              <div className={`mt-4 inline-block rounded-full px-5 py-2 font-body text-sm font-semibold ${VERDICT_META[result.verdict].bg} ${VERDICT_META[result.verdict].text}`}>
                {VERDICT_META[result.verdict].desc}
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-cream-300" />
              <span className="font-heading text-lg text-brand-gold">✦</span>
              <div className="h-px flex-1 bg-cream-300" />
            </div>

            {/* Room breakdown */}
            <h3 className="mb-4 font-heading text-xl font-semibold text-brand-indigo">
              Room-by-Room Breakdown
            </h3>
            <div className="space-y-3">
              {result.rooms.map((r) => (
                <div
                  key={r.room}
                  className="rounded-xl border border-cream-300 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl" aria-hidden>{r.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-body text-sm font-semibold text-brand-indigo">
                        {r.label}
                      </span>
                      <span className="mx-2 text-indigo-300">·</span>
                      <span className="font-body text-sm text-indigo-600">
                        {r.directionLabel}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-0.5 font-body text-xs font-semibold ${TIER_PILL[r.tier]}`}
                    >
                      {TIER_LABEL[r.tier]}
                    </span>
                    <span className="shrink-0 font-body text-xs text-indigo-400">
                      {r.contribution.toFixed(1)} / {r.weight} pts
                    </span>
                  </div>

                  {/* Remedy toggle */}
                  <button
                    onClick={() => toggleRemedy(r.room)}
                    className="mt-2 font-body text-xs font-medium text-brand-saffron hover:underline focus:outline-none"
                  >
                    {expanded[r.room] ? "Hide remedy ▴" : "View remedy ▾"}
                  </button>
                  {expanded[r.room] && (
                    <p className="mt-2 rounded-lg bg-cream-100 px-4 py-3 font-body text-sm leading-relaxed text-indigo-700">
                      {r.remedy}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-cream-300" />
              <span className="font-heading text-lg text-brand-gold">✦</span>
              <div className="h-px flex-1 bg-cream-300" />
            </div>

            {/* Save section */}
            {isLoaded && (
              isSignedIn ? (
                savedId ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                    <p className="mb-3 font-body text-sm font-semibold text-green-800">
                      ✓ Saved to your profile!
                    </p>
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                      <Button asChild className="bg-brand-saffron text-cream-200 hover:bg-saffron-600">
                        <a href={`/api/homes/${savedId}/report`} download>
                          ↓ Download PDF Report
                        </a>
                      </Button>
                      <Button asChild variant="link" className="text-brand-saffron">
                        <Link href="/homes">View in My Homes →</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-cream-300 bg-white p-5">
                    <h4 className="mb-1 font-heading text-lg font-semibold text-brand-indigo">
                      Save this score
                    </h4>
                    <p className="mb-4 font-body text-sm text-indigo-600">
                      Save to your profile so you can track improvements over time.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        placeholder="Label (e.g. My Flat, Pune)"
                        value={homeLabel}
                        onChange={(e) => setHomeLabel(e.target.value)}
                        className="flex-1 rounded-md border border-indigo-200 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder:text-indigo-300 focus:outline-none focus:ring-1 focus:ring-brand-saffron"
                      />
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="shrink-0 bg-brand-saffron text-cream-200 hover:bg-saffron-600 disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save to My Homes"}
                      </Button>
                    </div>
                    {saveError && (
                      <p className="mt-2 font-body text-xs text-red-600">{saveError}</p>
                    )}
                  </div>
                )
              ) : (
                <div className="rounded-xl border border-brand-indigo/20 bg-brand-indigo/5 p-5 text-center">
                  <p className="mb-1 font-heading text-lg font-semibold text-brand-indigo">
                    Want to keep this score?
                  </p>
                  <p className="mb-4 font-body text-sm text-indigo-600">
                    Create a free account to save your results, track improvements, and
                    access personalised remedies.
                  </p>
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button asChild className="bg-brand-saffron text-cream-200 hover:bg-saffron-600">
                      <Link href="/sign-up">Create free account</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* ── How it works (always visible) ───────────────────────── */}
      <section className="bg-brand-indigo px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-cream-200">
            How the Score Works
          </h2>
          <p className="font-body text-sm leading-relaxed text-cream-300">
            Each room is weighted by its Vastu importance — entrance (22 pts),
            kitchen (20 pts), master bedroom (18 pts), pooja room (14 pts),
            toilet (14 pts), living room (12 pts). A direction classified as{" "}
            <strong className="text-brand-gold">Ideal</strong> earns the full
            weight; <strong className="text-cream-200">Acceptable</strong> earns
            65 %; <strong className="text-cream-200">Neutral</strong> earns 30 %;
            and <strong className="text-red-400">Needs Attention</strong> earns
            0 pts but comes with a targeted no-demolition remedy.
          </p>
        </div>
      </section>
    </div>
  );
}
