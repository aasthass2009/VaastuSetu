"use client";

import { useState, useEffect, useRef } from "react";

const VERDICT_COLORS = {
  Excellent: "#16a34a",
  Good:      "#d97706",
  Fair:      "#ea580c",
  Poor:      "#dc2626",
} as const;

export type Verdict = keyof typeof VERDICT_COLORS;

export function ScoreDial({ score, verdict }: { score: number; verdict: Verdict }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

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
  const strokeColor = VERDICT_COLORS[verdict];

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 200 200"
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
        out of 100
      </text>
      <text x="100" y="138" textAnchor="middle" fontSize="17" fontWeight="600" fill={strokeColor} fontFamily="Georgia, 'Times New Roman', serif">
        {verdict}
      </text>
    </svg>
  );
}
