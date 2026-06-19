"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculate } from "@/lib/vaastu/engine";
import { DIRECTIONS, ROOM_CONFIGS } from "@/lib/vaastu/rules";
import type { Direction, RoomType, ScoreResult, ScoreTier } from "@/lib/vaastu/types";
import { ReportDownloadButton } from "@/components/payment/report-download-button";

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

const VERDICT_COLOR: Record<string, { color: string; bg: string; text: string }> = {
  Excellent: { color: "#16a34a", bg: "bg-green-50",  text: "text-green-800" },
  Good:      { color: "#d97706", bg: "bg-amber-50",  text: "text-amber-800" },
  Fair:      { color: "#ea580c", bg: "bg-orange-50", text: "text-orange-800" },
  Poor:      { color: "#dc2626", bg: "bg-red-50",    text: "text-red-800" },
};

function ScoreDial({ score, verdict }: { score: number; verdict: string }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);
  const t = useTranslations("vaastuScore");

  useEffect(() => {
    setDisplayed(0);
    const start = Date.now();
    const duration = 1200;
    function step() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const RADIUS = 80;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - displayed / 100);
  const strokeColor = VERDICT_COLOR[verdict]?.color ?? "#6b6080";

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-48 h-48 sm:w-56 sm:h-56"
      aria-label={`Vastu score: ${score} out of 100 — ${verdict}`}
    >
      <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#e8dfc8" strokeWidth="14" />
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
      <text x="100" y="88" textAnchor="middle" fontSize="48" fontWeight="700" fill="#241B3A" fontFamily="Georgia, 'Times New Roman', serif">
        {displayed}
      </text>
      <text x="100" y="110" textAnchor="middle" fontSize="13" fill="#6b6080" fontFamily="system-ui, sans-serif">
        {t("outOf100")}
      </text>
      <text x="100" y="138" textAnchor="middle" fontSize="17" fontWeight="600" fill={strokeColor} fontFamily="Georgia, 'Times New Roman', serif">
        {verdict}
      </text>
    </svg>
  );
}

export default function VaastuScorePage() {
  const { userId, isLoaded } = useAuth();
  const isSignedIn = isLoaded && !!userId;
  const t = useTranslations("vaastuScore");
  const tCommon = useTranslations("common");

  const [selections, setSelections] = useState<Record<RoomType, Direction>>(DEFAULT_SELECTIONS);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [expanded, setExpanded] = useState<Record<RoomType, boolean>>({
    entrance: false, kitchen: false, bedroom: false,
    pooja: false, toilet: false, living: false,
  });

  const [homeLabel, setHomeLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  // Translated lookup maps
  const tierLabel: Record<ScoreTier, string> = {
    ideal:   t("tiers.ideal"),
    okay:    t("tiers.okay"),
    neutral: t("tiers.neutral"),
    avoid:   t("tiers.avoid"),
  };

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
      {/* Page header */}
      <section className="bg-brand-indigo px-4 py-14 text-center sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            {t("tagline")}
          </p>
          <h1 className="mb-5 font-heading text-4xl font-semibold text-cream-200 sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="font-body text-base leading-relaxed text-cream-300 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Input form */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-brand-indigo">
            {t("formHeading")}
          </h2>
          <p className="mb-4 font-body text-sm text-indigo-600">
            {t("formHint")}
          </p>
          <p className="mb-8 font-body text-sm text-indigo-600">
            {t("compassPrompt")}{" "}
            <Link href="/compass" className="font-medium text-brand-saffron underline-offset-4 hover:underline">
              {t("compassLink")}
            </Link>
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {ROOM_ORDER.map((room) => {
              const cfg = ROOM_CONFIGS[room];
              return (
                <div key={room} className="rounded-xl border border-cream-300 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>{cfg.icon}</span>
                    <span className="font-body text-sm font-semibold text-brand-indigo">
                      {t(`rooms.${room}`)}
                    </span>
                    <span className="ml-auto font-body text-xs text-indigo-400">
                      {cfg.weight} {t("pts")}
                    </span>
                  </div>
                  <Select
                    value={selections[room]}
                    onValueChange={(val) =>
                      setSelections((prev) => ({ ...prev, [room]: val as Direction }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={tCommon("selectDirection")} />
                    </SelectTrigger>
                    <SelectContent>
                      {DIRECTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {t(`directions.${d}`)}
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
              {t("calculateBtn")}
            </Button>
          </div>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section
          ref={resultsRef}
          className="border-t border-cream-300 bg-cream-200 px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12"
        >
          <div className="mx-auto max-w-3xl">

            {/* Score dial */}
            <div className="mb-6 flex flex-col items-center text-center">
              <ScoreDial score={result.total} verdict={result.verdict} />
              <div className={`mt-4 rounded-xl px-4 py-3 font-body text-sm font-semibold text-center max-w-xs mx-auto ${VERDICT_COLOR[result.verdict]?.bg ?? "bg-slate-50"} ${VERDICT_COLOR[result.verdict]?.text ?? "text-slate-800"}`}>
                {t(`verdicts.${result.verdict}` as Parameters<typeof t>[0])}
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
              {t("roomBreakdown")}
            </h3>
            <div className="space-y-3">
              {result.rooms.map((r) => (
                <div key={r.room} className="rounded-xl border border-cream-300 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-xl shrink-0" aria-hidden>{r.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-body text-sm font-semibold text-brand-indigo">
                          {t(`rooms.${r.room}` as Parameters<typeof t>[0])}
                        </span>
                        <span className="font-body text-sm text-indigo-500">
                          {t(`directions.${Object.keys({"N":1,"NE":2,"E":3,"SE":4,"S":5,"SW":6,"W":7,"NW":8}).find(k => k === selections[r.room]) ?? "N"}` as Parameters<typeof t>[0])}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${TIER_PILL[r.tier]}`}>
                          {tierLabel[r.tier]}
                        </span>
                        <span className="font-body text-xs text-indigo-400">
                          {r.contribution.toFixed(1)} / {r.weight} {t("pts")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRemedy(r.room)}
                    className="mt-2 font-body text-xs font-medium text-brand-saffron hover:underline focus:outline-none"
                  >
                    {expanded[r.room] ? t("hideRemedy") : t("viewRemedy")}
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
                  <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                    <p className="mb-4 text-center font-body text-sm font-semibold text-green-800">
                      {t("savedMsg")}
                    </p>
                    <ReportDownloadButton homeId={savedId} />
                    <div className="mt-3 text-center">
                      <Button asChild variant="link" className="text-brand-saffron">
                        <Link href="/homes">{t("viewInHomes")}</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-cream-300 bg-white p-5">
                    <h4 className="mb-1 font-heading text-lg font-semibold text-brand-indigo">
                      {t("saveHeading")}
                    </h4>
                    <p className="mb-4 font-body text-sm text-indigo-600">
                      {t("saveDesc")}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        placeholder={t("savePlaceholder")}
                        value={homeLabel}
                        onChange={(e) => setHomeLabel(e.target.value)}
                        className="flex-1 rounded-md border border-indigo-200 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder:text-indigo-300 focus:outline-none focus:ring-1 focus:ring-brand-saffron"
                      />
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="shrink-0 bg-brand-saffron text-cream-200 hover:bg-saffron-600 disabled:opacity-60"
                      >
                        {saving ? t("saving") : t("saveBtn")}
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
                    {t("signupHeading")}
                  </p>
                  <p className="mb-4 font-body text-sm text-indigo-600">
                    {t("signupDesc")}
                  </p>
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button asChild className="bg-brand-saffron text-cream-200 hover:bg-saffron-600">
                      <Link href="/sign-up">{t("createAccount")}</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
                      <Link href="/sign-in">{t("signIn")}</Link>
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-brand-indigo px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-cream-200">
            {t("howItWorksHeading")}
          </h2>
          <p className="font-body text-sm leading-relaxed text-cream-300">
            {t("howItWorksBody")}
          </p>
        </div>
      </section>
    </div>
  );
}
