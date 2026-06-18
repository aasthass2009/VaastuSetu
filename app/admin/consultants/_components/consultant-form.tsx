"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ConsultantRow = {
  id: string;
  city: string | null;
  bio: string | null;
  specialisations: string[];
  languages: string[];
  experienceYears: number;
  hourlyRateINR: number | null;
  isAvailable: boolean;
  ratingAvg: number | null;
  ratingCount: number;
  user: { name: string | null; email: string };
};

type Props = {
  consultant?: ConsultantRow;
  onSuccess: (updated: ConsultantRow) => void;
  onCancel: () => void;
  isNew?: boolean;
};

export function ConsultantForm({ consultant, onSuccess, onCancel, isNew }: Props) {
  const [name, setName] = useState(consultant?.user.name ?? "");
  const [email, setEmail] = useState(consultant?.user.email ?? "");
  const [city, setCity] = useState(consultant?.city ?? "");
  const [bio, setBio] = useState(consultant?.bio ?? "");
  const [specialisations, setSpecialisations] = useState(
    consultant?.specialisations.join(", ") ?? ""
  );
  const [languages, setLanguages] = useState(
    consultant?.languages.join(", ") ?? ""
  );
  const [experienceYears, setExperienceYears] = useState(
    String(consultant?.experienceYears ?? "")
  );
  const [hourlyRateINR, setHourlyRateINR] = useState(
    String(consultant?.hourlyRateINR ?? "")
  );
  const [isAvailable, setIsAvailable] = useState(consultant?.isAvailable ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      city: city.trim() || null,
      bio: bio.trim() || null,
      specialisations: specialisations.split(",").map((s) => s.trim()).filter(Boolean),
      languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
      experienceYears: parseInt(experienceYears) || 0,
      hourlyRateINR: parseInt(hourlyRateINR) || null,
      isAvailable,
    };

    try {
      const url = isNew
        ? "/api/admin/consultants"
        : `/api/admin/consultants/${consultant!.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-lg border border-cream-300 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder-indigo-300 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">Name *</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">Email *</label>
          <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!isNew} />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">City</label>
          <input className={field} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Bangalore" />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">Experience (years)</label>
          <input type="number" min={0} className={field} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">Hourly Rate (₹)</label>
          <input type="number" min={0} className={field} value={hourlyRateINR} onChange={(e) => setHourlyRateINR(e.target.value)} placeholder="e.g. 4500" />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-brand-indigo">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-cream-300 accent-brand-saffron"
            />
            Available for bookings
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">
          Specialisations <span className="font-normal text-indigo-400">(comma-separated)</span>
        </label>
        <input className={field} value={specialisations} onChange={(e) => setSpecialisations(e.target.value)} placeholder="Residential, Commercial, Remedial Vastu" />
      </div>

      <div>
        <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">
          Languages <span className="font-normal text-indigo-400">(comma-separated)</span>
        </label>
        <input className={field} value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Hindi, Tamil" />
      </div>

      <div>
        <label className="mb-1 block font-body text-xs font-medium text-brand-indigo">Bio</label>
        <textarea className={`${field} resize-none`} rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 font-body text-sm text-red-700">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isNew ? "Add Consultant" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
