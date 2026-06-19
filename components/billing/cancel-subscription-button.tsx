"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CancelSubscriptionButton({ periodEnd }: { periodEnd: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCancel() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/cancel", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Failed to cancel. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  const endDate = new Date(periodEnd).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  if (confirming) {
    return (
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="mb-3 font-body text-sm text-red-700">
          You&apos;ll keep Pro access until <strong>{endDate}</strong>, then revert to Free. Are you sure?
        </p>
        {error && <p className="mb-2 font-body text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Cancelling…" : "Yes, cancel"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setConfirming(false); setError(""); }}
            disabled={loading}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Keep Pro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setConfirming(true)}
      className="mt-3 border-red-300 font-body text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
    >
      Cancel subscription
    </Button>
  );
}
