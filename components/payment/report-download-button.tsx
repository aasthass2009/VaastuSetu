"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RazorpayCheckout } from "./razorpay-checkout";

interface AccessResponse {
  hasAccess: boolean;
  reason?: string;
  plan?: string;
  periodEnd?: string;
}

interface Props {
  homeId: string;
}

export function ReportDownloadButton({ homeId }: Props) {
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/payments/access?homeId=${homeId}`)
      .then((r) => r.json())
      .then((d: AccessResponse) => setAccess(d))
      .catch(() => setAccess({ hasAccess: false, reason: "error" }));
  }, [homeId]);

  function handleSuccess() {
    setAccess({ hasAccess: true, reason: "report_purchased" });
    setError("");
  }

  // Loading
  if (!access) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-5 py-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-saffron border-t-transparent" />
        <span className="font-body text-sm text-indigo-500">Checking access…</span>
      </div>
    );
  }

  // Has access — show download link
  if (access.hasAccess) {
    const isPro = access.reason === "pro_subscription";
    const periodEndStr = access.periodEnd
      ? new Date(access.periodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : null;

    return (
      <div className="flex flex-col gap-2">
        {isPro && periodEndStr && (
          <p className="text-center font-body text-xs text-brand-gold">
            ✦ Pro — active until {periodEndStr}
          </p>
        )}
        <Button asChild className="bg-brand-saffron text-cream-200 hover:bg-saffron-600">
          <a href={`/api/homes/${homeId}/report`} download>
            ↓ Download Full PDF Report
          </a>
        </Button>
      </div>
    );
  }

  // No access — show paywall
  return (
    <div className="w-full rounded-xl border border-brand-indigo/20 bg-white p-5 shadow-sm">
      <div className="mb-4 text-center">
        <span className="text-2xl">🔒</span>
        <h4 className="mt-1 font-heading text-base font-semibold text-brand-indigo">
          Full Report Locked
        </h4>
        <p className="mt-1 font-body text-xs text-indigo-500">
          Room-by-room PDF with all remedies &amp; personalised recommendations
        </p>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 font-body text-xs text-red-600">{error}</p>
      )}

      {/* One-time unlock */}
      <RazorpayCheckout
        homeId={homeId}
        type="REPORT_UNLOCK"
        onSuccess={handleSuccess}
        onError={setError}
      >
        {(pay, loading) => (
          <Button
            onClick={pay}
            disabled={loading}
            className="w-full bg-brand-saffron text-cream-200 hover:bg-saffron-600 disabled:opacity-60"
          >
            {loading ? "Opening payment…" : "Buy Full Report — ₹499"}
          </Button>
        )}
      </RazorpayCheckout>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-cream-300" />
        <span className="font-body text-xs text-indigo-400">or</span>
        <div className="h-px flex-1 bg-cream-300" />
      </div>

      {/* Pro subscription */}
      <div className="rounded-lg border border-brand-gold/30 bg-brand-gold/5 p-4">
        <p className="mb-0.5 font-heading text-sm font-semibold text-brand-indigo">
          Go Pro — ₹299/month
        </p>
        <p className="mb-3 font-body text-xs text-indigo-500">
          Unlimited PDF reports for all your homes
        </p>
        <RazorpayCheckout
          type="SUBSCRIPTION"
          onSuccess={handleSuccess}
          onError={setError}
        >
          {(pay, loading) => (
            <Button
              onClick={pay}
              disabled={loading}
              variant="outline"
              className="w-full border-brand-gold text-brand-indigo hover:bg-brand-gold/10 disabled:opacity-60"
            >
              {loading ? "Opening payment…" : "Subscribe to Pro — ₹299/month"}
            </Button>
          )}
        </RazorpayCheckout>
      </div>

      <p className="mt-3 text-center font-body text-[10px] text-indigo-400">
        Secured by Razorpay · Test mode — use card 4111 1111 1111 1111
      </p>
    </div>
  );
}
