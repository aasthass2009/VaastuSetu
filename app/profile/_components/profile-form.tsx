"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada",
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Other",
];

type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  preferredLanguage: string | null;
  role: string;
  createdAt: string;
};

export function ProfileForm({ user }: { user: UserProfile }) {
  const [name, setName]               = useState(user.name ?? "");
  const [phone, setPhone]             = useState(user.phone ?? "");
  const [city, setCity]               = useState(user.city ?? "");
  const [country, setCountry]         = useState(user.country ?? "");
  const [lang, setLang]               = useState(user.preferredLanguage ?? "");
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState("");

  const isDirty =
    name !== (user.name ?? "") ||
    phone !== (user.phone ?? "") ||
    city !== (user.city ?? "") ||
    country !== (user.country ?? "") ||
    lang !== (user.preferredLanguage ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city, country, preferredLanguage: lang }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-cream-300 bg-cream-200 px-3 py-2.5 font-body text-sm text-brand-indigo placeholder-indigo-300 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={inputCls}
        />
      </div>

      {/* Email — read-only */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Email <span className="font-normal text-indigo-400">(managed by your account)</span>
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-lg border border-cream-300 bg-cream-300/60 px-3 py-2.5 font-body text-sm text-indigo-400 cursor-not-allowed"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Phone <span className="font-normal text-indigo-400">(optional)</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className={inputCls}
        />
      </div>

      {/* City + Country */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Bangalore"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. India"
            className={inputCls}
          />
        </div>
      </div>

      {/* Preferred language */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-brand-indigo">
          Preferred Language
        </label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className={inputCls}
        >
          <option value="">Select a language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Feedback */}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-green-600">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <p className="font-body text-sm font-medium text-green-700">Changes saved successfully.</p>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="font-body text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={saving || !isDirty} className="w-full sm:w-auto">
        {saving ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
