"use client";

import { useState } from "react";

type BookingRow = {
  id: string;
  scheduledAt: string;
  durationMins: number;
  status: string;
  user: { name: string | null; email: string };
  consultant: { user: { name: string | null } };
};

const BADGE: Record<string, string> = {
  PENDING:   "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-indigo-100 text-indigo-700",
  CANCELLED: "bg-red-100 text-red-600",
  NO_SHOW:   "bg-gray-100 text-gray-500",
};

const ACTIONS: Record<string, { label: string; next: string }[]> = {
  PENDING:   [{ label: "Confirm",  next: "CONFIRMED" }, { label: "Cancel", next: "CANCELLED" }],
  CONFIRMED: [{ label: "Complete", next: "COMPLETED" }, { label: "Cancel", next: "CANCELLED" }],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW:   [],
};

export function BookingsClient({ initial }: { initial: BookingRow[] }) {
  const [bookings, setBookings] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setLoading(id + status);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } catch {
      alert("Could not update booking status.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => {
        const dt = new Date(b.scheduledAt).toLocaleString("en-IN", {
          weekday: "short", day: "numeric", month: "short",
          year: "numeric", hour: "2-digit", minute: "2-digit",
        });
        const actions = ACTIONS[b.status] ?? [];
        return (
          <div
            key={b.id}
            className="rounded-2xl border border-cream-300 bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-body text-sm font-semibold text-brand-indigo">
                    {b.user.name ?? b.user.email}
                  </p>
                  <span className="font-body text-xs text-indigo-400">→</span>
                  <p className="font-body text-sm text-indigo-600">
                    {b.consultant.user.name ?? "—"}
                  </p>
                  <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${BADGE[b.status] ?? BADGE.PENDING}`}>
                    {b.status}
                  </span>
                </div>
                <p className="mt-0.5 font-body text-xs text-indigo-400">
                  {dt} · {b.durationMins} min
                </p>
                <p className="font-body text-xs text-indigo-300">{b.user.email}</p>
              </div>
              {actions.length > 0 && (
                <div className="flex shrink-0 gap-2">
                  {actions.map(({ label, next }) => (
                    <button
                      key={next}
                      onClick={() => updateStatus(b.id, next)}
                      disabled={loading === b.id + next}
                      className={[
                        "rounded-lg border px-3 py-1.5 font-body text-xs font-medium transition-colors disabled:opacity-50",
                        next === "CANCELLED"
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200",
                      ].join(" ")}
                    >
                      {loading === b.id + next ? "…" : label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
