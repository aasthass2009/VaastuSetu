"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConsultantForm } from "./consultant-form";

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

export function AdminConsultantClient({
  initial,
}: {
  initial: ConsultantRow[];
}) {
  const [consultants, setConsultants] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleSaved(updated: ConsultantRow) {
    setConsultants((prev) => {
      const exists = prev.find((c) => c.id === updated.id);
      if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
      return [updated, ...prev];
    });
    setEditingId(null);
    setAddingNew(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this consultant? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/consultants/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setConsultants((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Could not delete consultant.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-brand-indigo">
          Consultants ({consultants.length})
        </h1>
        {!addingNew && (
          <Button onClick={() => { setAddingNew(true); setEditingId(null); }}>
            + Add Consultant
          </Button>
        )}
      </div>

      {/* Add new form */}
      {addingNew && (
        <div className="mb-8 rounded-2xl border border-cream-300 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-brand-indigo">New Consultant</h2>
          <ConsultantForm
            isNew
            onSuccess={handleSaved}
            onCancel={() => setAddingNew(false)}
          />
        </div>
      )}

      {/* Consultant list */}
      <div className="space-y-4">
        {consultants.map((c) => (
          <div key={c.id} className="rounded-2xl border border-cream-300 bg-white p-5">
            {editingId === c.id ? (
              <>
                <h2 className="mb-4 font-heading text-base font-semibold text-brand-indigo">
                  Editing {c.user.name}
                </h2>
                <ConsultantForm
                  consultant={c}
                  onSuccess={handleSaved}
                  onCancel={() => setEditingId(null)}
                />
              </>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-heading text-lg font-semibold text-brand-indigo">
                      {c.user.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${
                        c.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {c.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="mt-0.5 font-body text-sm text-indigo-500">
                    {c.user.email} · {c.city ?? "—"} · {c.experienceYears} yrs · ₹{(c.hourlyRateINR ?? 0).toLocaleString("en-IN")}/hr
                  </p>
                  <p className="mt-1 font-body text-xs text-indigo-400">
                    {c.specialisations.join(", ")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingId(c.id); setAddingNew(false); }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                  >
                    {deletingId === c.id ? "…" : "Delete"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
