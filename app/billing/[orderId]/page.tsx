import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

export const metadata: Metadata = { title: "Receipt | VaastuSetu" };

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  PAID:     { label: "Paid",     cls: "bg-green-100 text-green-700" },
  CREATED:  { label: "Pending",  cls: "bg-amber-100 text-amber-700" },
  FAILED:   { label: "Failed",   cls: "bg-red-100 text-red-600" },
  REFUNDED: { label: "Refunded", cls: "bg-slate-100 text-slate-500" },
};

const ITEM_LABEL: Record<string, string> = {
  REPORT_UNLOCK: "Full Vastu Report — one-time unlock",
  SUBSCRIPTION:  "VaastuSetu Pro Plan — 1 month",
  CONSULTATION:  "Consultant Booking",
};

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [{ userId }, { orderId }] = await Promise.all([auth(), params]);
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser) redirect("/sign-in");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: dbUser.id },
  });
  if (!order) notFound();

  const badge = STATUS_STYLE[order.status] ?? STATUS_STYLE.CREATED;
  const item  = ITEM_LABEL[order.type] ?? order.description ?? "Purchase";
  const amountINR = (order.amountPaise / 100).toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  });
  const date = new Date(order.createdAt).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const rows: { label: string; value: string }[] = [
    { label: "Order ID",       value: order.id },
    { label: "Date",           value: date },
    { label: "Item",           value: item },
    { label: "Amount",         value: amountINR },
    { label: "Currency",       value: order.currency },
    { label: "Status",         value: badge.label },
    ...(order.razorpayOrderId
      ? [{ label: "Razorpay Order", value: order.razorpayOrderId }]
      : []),
    ...(order.razorpayPaymentId
      ? [{ label: "Payment ID", value: order.razorpayPaymentId }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-cream-200">
      <div className="bg-brand-indigo px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <p className="mb-1 font-body text-xs font-medium uppercase tracking-widest text-brand-gold">
            Receipt
          </p>
          <h1 className="font-heading text-3xl font-semibold text-cream-200">
            Order Details
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm md:p-8">

          {/* Status banner */}
          <div className="mb-6 flex items-center justify-between">
            <p className="font-body text-sm text-indigo-400">VaastuSetu</p>
            <span className={`rounded-full px-3 py-1 font-body text-sm font-semibold ${badge.cls}`}>
              {badge.label}
            </span>
          </div>

          {/* Amount */}
          <p className="mb-6 font-heading text-4xl font-semibold text-brand-indigo">
            {amountINR}
          </p>

          {/* Details table */}
          <dl className="space-y-3 border-t border-cream-300 pt-6">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-6">
                <dt className="w-36 shrink-0 font-body text-xs font-medium uppercase tracking-wider text-indigo-400">
                  {label}
                </dt>
                <dd className="break-all font-body text-sm text-indigo-700 font-mono">
                  {label === "Status" ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold not-italic font-sans ${badge.cls}`}>
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 font-body text-xs text-indigo-300">
            This is a test-mode receipt. No real money was charged.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 font-body text-sm">
          <Link href="/billing" className="text-brand-saffron underline-offset-4 hover:underline">
            ← Back to Billing
          </Link>
          <Link href="/dashboard" className="text-brand-saffron underline-offset-4 hover:underline">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
