import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { CancelSubscriptionButton } from "@/components/billing/cancel-subscription-button";

export const metadata: Metadata = {
  title: "Billing & Orders | VaastuSetu",
};

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  PAID:     { label: "Paid",     cls: "bg-green-100 text-green-700" },
  CREATED:  { label: "Pending",  cls: "bg-amber-100 text-amber-700" },
  FAILED:   { label: "Failed",   cls: "bg-red-100 text-red-600" },
  REFUNDED: { label: "Refunded", cls: "bg-slate-100 text-slate-500" },
};

const ITEM_LABEL: Record<string, string> = {
  REPORT_UNLOCK: "Full Vastu Report",
  SUBSCRIPTION:  "Pro Plan — 1 month",
  CONSULTATION:  "Consultant Booking",
};

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser) redirect("/sign-in");

  const [subscription, orders] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: dbUser.id } }),
    prisma.order.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const now = new Date();
  const isPro =
    subscription?.plan === "PRO" &&
    (subscription.status === "ACTIVE" || subscription.status === "CANCELLED") &&
    subscription.currentPeriodEnd != null &&
    new Date(subscription.currentPeriodEnd) > now;

  const isCancelled = subscription?.status === "CANCELLED";

  const periodEndStr = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-cream-200">
      {/* Page header */}
      <div className="bg-brand-indigo px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-1 font-body text-xs font-medium uppercase tracking-widest text-brand-gold">
            Account
          </p>
          <h1 className="font-heading text-3xl font-semibold text-cream-200 md:text-4xl">
            Billing &amp; Orders
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">

        {/* ── Subscription status ── */}
        <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-brand-indigo">
            Your Plan
          </h2>

          {isPro ? (
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-3 py-1 font-body text-sm font-semibold text-brand-gold">
                  ✦ Pro
                </span>
                {isCancelled ? (
                  <span className="font-body text-sm text-indigo-500">
                    Cancelled · access until {periodEndStr}
                  </span>
                ) : (
                  <span className="font-body text-sm text-indigo-500">
                    Active · renews {periodEndStr}
                  </span>
                )}
              </div>
              <p className="mt-2 font-body text-sm text-indigo-400">
                Unlimited PDF report downloads for all your homes.
              </p>
              {!isCancelled && subscription?.currentPeriodEnd && (
                <CancelSubscriptionButton
                  periodEnd={subscription.currentPeriodEnd.toISOString()}
                />
              )}
              {isCancelled && (
                <p className="mt-3 font-body text-xs text-indigo-400">
                  Your subscription has been cancelled. You can re-subscribe after {periodEndStr}.
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-cream-300 px-3 py-1 font-body text-sm font-semibold text-indigo-500">
                  Free
                </span>
              </div>
              <p className="mt-2 font-body text-sm text-indigo-400">
                Upgrade to Pro (₹299/month) for unlimited report downloads.
              </p>
              <Link
                href="/vaastu-score"
                className="mt-3 inline-block font-body text-sm font-medium text-brand-saffron underline-offset-4 hover:underline"
              >
                Score a home to upgrade →
              </Link>
            </div>
          )}
        </div>

        {/* ── Order history ── */}
        <div className="rounded-2xl border border-cream-300 bg-white shadow-sm">
          <div className="border-b border-cream-300 px-6 py-4">
            <h2 className="font-heading text-lg font-semibold text-brand-indigo">
              Order History
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-body text-sm text-indigo-400">No purchases yet.</p>
              <Link
                href="/vaastu-score"
                className="mt-2 inline-block font-body text-sm font-medium text-brand-saffron underline-offset-4 hover:underline"
              >
                Get your Vastu Score →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-cream-300">
              {orders.map((order) => {
                const badge = STATUS_STYLE[order.status] ?? STATUS_STYLE.CREATED;
                const item = ITEM_LABEL[order.type] ?? order.description ?? "Purchase";
                const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                });
                const amountINR = (order.amountPaise / 100).toLocaleString("en-IN", {
                  style: "currency", currency: "INR", maximumFractionDigits: 0,
                });

                return (
                  <li key={order.id}>
                    <Link
                      href={`/billing/${order.id}`}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-cream-100"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm font-semibold text-brand-indigo">
                          {item}
                        </p>
                        <p className="font-body text-xs text-indigo-400">{date}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-body text-sm font-semibold text-brand-indigo">
                          {amountINR}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${badge.cls}`}>
                          {badge.label}
                        </span>
                        <span className="font-body text-xs text-indigo-300">→</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Back links */}
        <div className="flex flex-wrap gap-4 pb-4 font-body text-sm">
          <Link href="/dashboard" className="text-brand-saffron underline-offset-4 hover:underline">
            ← Dashboard
          </Link>
          <Link href="/profile" className="text-brand-saffron underline-offset-4 hover:underline">
            Profile &amp; Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
