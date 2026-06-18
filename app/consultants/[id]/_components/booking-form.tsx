"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const TIME_SLOTS = [
  { label: "9:00 AM",  value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "2:00 PM",  value: "14:00" },
  { label: "3:00 PM",  value: "15:00" },
  { label: "4:00 PM",  value: "16:00" },
  { label: "5:00 PM",  value: "17:00" },
];

type Props = {
  consultantId: string;
  consultantName: string;
  hourlyRateINR: number;
  prefillName: string;
  prefillEmail: string;
  isLoggedIn: boolean;
};

type Confirmed = {
  bookingId: string;
  scheduledAt: string;
  consultantName: string;
  amountINR: number;
};

// Minimum date = tomorrow
function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// Maximum date = 60 days out
function maxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split("T")[0];
}

export function BookingForm({
  consultantId,
  consultantName,
  hourlyRateINR,
  prefillName,
  prefillEmail,
  isLoggedIn,
}: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const commissionINR = Math.round(hourlyRateINR * 0.2);
  const totalINR = hourlyRateINR;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time || !name.trim() || !email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultantId,
          scheduledAt,
          clientName: name.trim(),
          clientEmail: email.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setConfirmed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Confirmation state ─────────────────────────────────────────────────────
  if (confirmed) {
    const dt = new Date(confirmed.scheduledAt);
    const formatted = dt.toLocaleString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6 text-green-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mb-1 font-heading text-xl font-semibold text-green-800">
          Booking Requested!
        </h3>
        <p className="mb-4 font-body text-sm text-green-700">
          Your consultation with {confirmed.consultantName} has been requested.
        </p>
        <div className="mb-4 rounded-xl bg-white p-4 text-left text-sm font-body text-indigo-800 space-y-1.5 border border-green-200">
          <p><span className="font-medium">Date & Time:</span> {formatted}</p>
          <p><span className="font-medium">Consultant:</span> {confirmed.consultantName}</p>
          <p><span className="font-medium">Fee:</span> ₹{confirmed.amountINR.toLocaleString("en-IN")}</p>
          <p><span className="font-medium">Reference:</span> <span className="font-mono text-xs">{confirmed.bookingId.slice(-12).toUpperCase()}</span></p>
        </div>
        <p className="font-body text-xs text-green-600">
          Payment and confirmation will be handled shortly. Check your dashboard for status updates.
        </p>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Date <span className="text-brand-saffron">*</span>
        </label>
        <input
          type="date"
          min={minDate()}
          max={maxDate()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-cream-300 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          required
        />
      </div>

      {/* Time slots */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Time Slot <span className="text-brand-saffron">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => setTime(slot.value)}
              className={`rounded-lg border px-3 py-1.5 font-body text-sm transition-colors ${
                time === slot.value
                  ? "border-brand-saffron bg-brand-saffron text-white"
                  : "border-cream-300 bg-white text-indigo-700 hover:border-brand-saffron"
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Your Name <span className="text-brand-saffron">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-lg border border-cream-300 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder-indigo-300 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Email <span className="text-brand-saffron">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-cream-300 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder-indigo-300 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          required
        />
        {!isLoggedIn && (
          <p className="mt-1 font-body text-xs text-indigo-400">
            Sign in to pre-fill your details and track bookings in your dashboard.
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Notes <span className="text-indigo-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe your home, specific concerns, or questions…"
          rows={3}
          className="w-full rounded-lg border border-cream-300 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder-indigo-300 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron resize-none"
        />
      </div>

      {/* Price summary */}
      <div className="rounded-xl bg-cream-300 px-4 py-3 text-sm font-body">
        <div className="flex justify-between text-indigo-700">
          <span>Consultation fee</span>
          <span>₹{totalINR.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-indigo-400 text-xs mt-1">
          <span>Platform fee (20%)</span>
          <span>₹{commissionINR.toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-2 border-t border-cream-400 pt-2 flex justify-between font-semibold text-brand-indigo">
          <span>Total due</span>
          <span>₹{totalINR.toLocaleString("en-IN")}</span>
        </div>
        <p className="mt-1.5 text-xs text-indigo-400">Payment collected at confirmation. No charge now.</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 font-body text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Requesting…" : "Request Booking"}
      </Button>
    </form>
  );
}
