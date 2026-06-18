"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// iOS extends DeviceOrientationEvent with webkitCompassHeading
interface ExtendedOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

type CompassState = "idle" | "requesting" | "active" | "denied" | "unavailable";

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
type Dir = (typeof DIRECTIONS)[number];

const DIR_FULL: Record<Dir, string> = {
  N: "North",
  NE: "North-East",
  E: "East",
  SE: "South-East",
  S: "South",
  SW: "South-West",
  W: "West",
  NW: "North-West",
};

const DIR_VASTU: Record<Dir, string> = {
  N: "Ideal for entrances, study, treasury",
  NE: "Most auspicious — divine energy zone",
  E: "Ideal for entrances, prayer, sunrise rooms",
  SE: "Fire zone — ideal for kitchens",
  S: "Requires Vastu attention for entrances",
  SW: "Earth zone — stability, master bedroom",
  W: "Acceptable for garages, children's rooms",
  NW: "Air zone — guest rooms, children's rooms",
};

function getDirection(heading: number): Dir {
  const n = ((heading % 360) + 360) % 360;
  return DIRECTIONS[Math.round(n / 45) % 8];
}

// ── Compass SVG dial ─────────────────────────────────────────────────────────

function CompassDial({ heading }: { heading: number }) {
  const cx = 140;
  const cy = 140;

  // Tick marks: every 5° (72 total)
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

  // Direction labels on the rotating card
  const labels: Array<{
    dir: string;
    deg: number;
    color: string;
    size: number;
    weight: string;
    r: number;
  }> = [
    { dir: "N", deg: 0, color: "#C05A12", size: 20, weight: "700", r: 88 },
    { dir: "NE", deg: 45, color: "#9189cf", size: 12, weight: "500", r: 84 },
    { dir: "E", deg: 90, color: "#B8860B", size: 15, weight: "600", r: 88 },
    { dir: "SE", deg: 135, color: "#9189cf", size: 12, weight: "500", r: 84 },
    { dir: "S", deg: 180, color: "#B8860B", size: 15, weight: "600", r: 88 },
    { dir: "SW", deg: 225, color: "#9189cf", size: 12, weight: "500", r: 84 },
    { dir: "W", deg: 270, color: "#B8860B", size: 15, weight: "600", r: 88 },
    { dir: "NW", deg: 315, color: "#9189cf", size: 12, weight: "500", r: 84 },
  ];

  return (
    <svg
      viewBox="0 0 280 280"
      className="h-64 w-64 sm:h-72 sm:w-72"
      aria-label={`Compass dial showing ${Math.round(heading)}° heading`}
      role="img"
    >
      {/* Outer bezel */}
      <circle cx={cx} cy={cy} r={138} fill="#16112a" />
      <circle cx={cx} cy={cy} r={138} fill="none" stroke="#B8860B" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={133} fill="none" stroke="#3a3278" strokeWidth="0.5" />

      {/* ── Rotating compass card ── */}
      <g transform={`rotate(${-heading}, ${cx}, ${cy})`}>
        <circle cx={cx} cy={cy} r={129} fill="#1a1430" />

        {/* Degree tick marks */}
        {ticks.map((deg) => {
          const isCard = deg % 90 === 0;
          const isInter = deg % 45 === 0;
          const isMaj = deg % 10 === 0;
          const len = isCard ? 16 : isInter ? 11 : isMaj ? 7 : 4;
          const sw = isCard ? 2 : isInter ? 1.5 : 0.7;
          const col = isCard ? "#B8860B" : isInter ? "#6a60bc" : "#2e2760";
          const r1 = 118;
          const rad = (deg * Math.PI) / 180;
          const x1 = cx + r1 * Math.sin(rad);
          const y1 = cy - r1 * Math.cos(rad);
          const x2 = cx + (r1 - len) * Math.sin(rad);
          const y2 = cy - (r1 - len) * Math.cos(rad);
          return (
            <line
              key={deg}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={col} strokeWidth={sw}
            />
          );
        })}

        {/* Direction labels — counter-rotated so text stays readable */}
        {labels.map(({ dir, deg, color, size, weight, r }) => {
          const rad = (deg * Math.PI) / 180;
          const x = cx + r * Math.sin(rad);
          const y = cy - r * Math.cos(rad);
          return (
            <text
              key={dir}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize={size}
              fontWeight={weight}
              fontFamily="Georgia, serif"
              transform={`rotate(${heading}, ${x}, ${y})`}
            >
              {dir}
            </text>
          );
        })}

        {/* Needle — North half (saffron) */}
        <polygon
          points={`${cx},52 ${cx - 7},${cy} ${cx},${cy - 16} ${cx + 7},${cy}`}
          fill="#C05A12"
        />
        {/* Needle — South half (cream, faded) */}
        <polygon
          points={`${cx},228 ${cx - 7},${cy} ${cx},${cy + 16} ${cx + 7},${cy}`}
          fill="#FBF5EA"
          opacity="0.35"
        />
      </g>

      {/* Fixed top indicator ▼ */}
      <polygon points={`${cx},8 ${cx - 8},24 ${cx + 8},24`} fill="#C05A12" />

      {/* Centre hub */}
      <circle cx={cx} cy={cy} r={9} fill="#B8860B" />
      <circle cx={cx} cy={cy} r={5} fill="#16112a" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CompassPage() {
  const [state, setState] = useState<CompassState>("idle");
  const [heading, setHeading] = useState(0);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    if (typeof window !== "undefined" && !("DeviceOrientationEvent" in window)) {
      setState("unavailable");
    }
  }, []);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const ext = e as ExtendedOrientationEvent;
    let h: number | null = null;

    if (ext.webkitCompassHeading != null) {
      // iOS — gives true compass heading (0 = North, clockwise)
      h = ext.webkitCompassHeading;
    } else if (e.alpha != null) {
      // Android / standard — alpha is counterclockwise from N
      h = (360 - e.alpha) % 360;
    }

    if (h != null) {
      setHeading(h);
      setState("active");
    }
  }, []);

  async function start() {
    setState("requesting");
    try {
      // iOS 13+ requires permission
      const DevOrEv = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DevOrEv.requestPermission === "function") {
        const perm = await DevOrEv.requestPermission();
        if (perm !== "granted") {
          setState("denied");
          return;
        }
      }
    } catch {
      setState("denied");
      return;
    }

    // Prefer absolute orientation (Chrome Android gives real compass heading)
    const hasAbsolute = "ondeviceorientationabsolute" in (window as unknown as Record<string, unknown>);
    const eventName = (hasAbsolute ? "deviceorientationabsolute" : "deviceorientation") as "deviceorientation";
    window.addEventListener(eventName, handleOrientation, true);
    setState("active");
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener(
        "deviceorientationabsolute" as "deviceorientation",
        handleOrientation,
        true
      );
    };
  }, [handleOrientation]);

  const dir = getDirection(heading);
  const fullDir = DIR_FULL[dir];
  const vastuHint = DIR_VASTU[dir];

  return (
    <div className="min-h-screen bg-brand-indigo">
      {/* Page header */}
      <section className="px-6 py-10 text-center">
        <p className="mb-2 font-body text-xs font-medium uppercase tracking-widest text-brand-gold">
          Direction Tool
        </p>
        <h1 className="font-heading text-4xl font-semibold text-cream-200 md:text-5xl">
          Vastu Compass
        </h1>
        <p className="mx-auto mt-3 max-w-sm font-body text-sm leading-relaxed text-cream-300">
          Use your phone's compass to find the facing direction of your home.
        </p>
      </section>

      {/* Main content */}
      <div className="flex flex-col items-center gap-6 px-6 pb-16">

        {/* ── Unavailable ── */}
        {state === "unavailable" && (
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="mb-4 text-5xl" aria-hidden>🧭</div>
            <h2 className="mb-2 font-heading text-xl font-semibold text-cream-200">
              Compass Not Available
            </h2>
            <p className="font-body text-sm leading-relaxed text-cream-300">
              Your device doesn't have an orientation sensor, or this is a
              desktop browser. Open this page on your phone to use the compass.
            </p>
          </div>
        )}

        {/* ── Permission denied ── */}
        {state === "denied" && (
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <div className="mb-4 text-5xl" aria-hidden>🚫</div>
            <h2 className="mb-2 font-heading text-xl font-semibold text-cream-200">
              Permission Denied
            </h2>
            <p className="mb-5 font-body text-sm leading-relaxed text-cream-300">
              Motion access was denied. On iPhone, go to{" "}
              <strong className="text-cream-200">
                Settings → Safari → Motion &amp; Orientation Access
              </strong>{" "}
              and enable it, then reload this page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-cream-300 text-cream-200 hover:bg-white/10"
            >
              Reload Page
            </Button>
          </div>
        )}

        {/* ── Idle / requesting — show static dial + start button ── */}
        {(state === "idle" || state === "requesting") && (
          <div className="flex w-full max-w-sm flex-col items-center gap-6">
            <CompassDial heading={0} />

            {/* Tip */}
            <div className="w-full rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-5 py-4">
              <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-brand-gold">
                How to use
              </p>
              <p className="font-body text-sm leading-relaxed text-cream-300">
                Stand at your main door facing outward to read your home's
                facing direction.
              </p>
            </div>

            <Button
              onClick={start}
              disabled={state === "requesting"}
              size="lg"
              className="min-w-[200px] bg-brand-saffron text-cream-200 hover:bg-saffron-600 disabled:opacity-60"
              aria-label="Start compass sensor"
            >
              {state === "requesting"
                ? "Requesting access…"
                : isIOS
                ? "Enable Compass"
                : "Start Compass"}
            </Button>

            {isIOS && (
              <p className="font-body text-xs text-cream-300/60">
                iOS requires permission to access the motion sensor.
              </p>
            )}
          </div>
        )}

        {/* ── Active — live compass ── */}
        {state === "active" && (
          <div className="flex w-full max-w-sm flex-col items-center gap-5">
            <CompassDial heading={heading} />

            {/* Direction readout */}
            <div
              className="w-full rounded-2xl border border-brand-gold/20 bg-white/5 p-5 text-center"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="font-body text-xs font-medium uppercase tracking-widest text-brand-gold">
                You are facing
              </p>
              <p className="mt-1 font-heading text-6xl font-semibold text-cream-200">
                {dir}
              </p>
              <p className="mt-1 font-body text-base text-cream-300">
                {fullDir} · {Math.round(heading)}°
              </p>
            </div>

            {/* Vastu hint for this direction */}
            <div className="w-full rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-5 py-4">
              <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-brand-gold">
                Vastu note
              </p>
              <p className="font-body text-sm leading-relaxed text-cream-300">
                {vastuHint}
              </p>
            </div>

            {/* Tip */}
            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="font-body text-sm leading-relaxed text-cream-300">
                <strong className="text-cream-200">Tip:</strong> Stand at your
                main door facing outward to read your home's facing direction.
              </p>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-4 text-center">
          <Link
            href="/vaastu-score"
            className="font-body text-sm text-brand-saffron underline-offset-4 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
          >
            ← Back to Vastu Score
          </Link>
        </div>
      </div>
    </div>
  );
}
