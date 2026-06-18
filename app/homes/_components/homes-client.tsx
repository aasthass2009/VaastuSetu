"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type HomeItem = {
  id: string;
  label: string;
  vaastuScore: number | null;
  scoredAt: string | null;
  createdAt: string;
  plotFacing: string | null;
};

function scoreColor(score: number | null) {
  if (score === null) return "text-indigo-400";
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function verdict(score: number | null) {
  if (score === null) return null;
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export function HomesClient({ homes: initial }: { homes: HomeItem[] }) {
  const router = useRouter();
  const [homes, setHomes] = useState(initial);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function openRename(home: HomeItem) {
    setRenameValue(home.label);
    setRenameId(home.id);
  }

  async function handleRename() {
    if (!renameId || !renameValue.trim()) return;
    setRenaming(true);
    try {
      const res = await fetch(`/api/homes/${renameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: renameValue.trim() }),
      });
      if (!res.ok) throw new Error();
      setHomes((prev) =>
        prev.map((h) =>
          h.id === renameId ? { ...h, label: renameValue.trim() } : h
        )
      );
      setRenameId(null);
    } finally {
      setRenaming(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/homes/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setHomes((prev) => prev.filter((h) => h.id !== deleteId));
      setCompareIds((prev) => prev.filter((id) => id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  if (homes.length === 0) {
    return (
      <div className="rounded-2xl border border-cream-300 bg-white py-16 text-center">
        <p className="mb-1 font-heading text-xl text-brand-indigo">No saved homes yet</p>
        <p className="mb-6 font-body text-sm text-indigo-600">
          Score a property to start building your portfolio.
        </p>
        <Button asChild className="bg-brand-saffron text-cream-200 hover:bg-saffron-600">
          <Link href="/vaastu-score">Score your first home →</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {homes.length >= 2 && (
          <Button
            size="sm"
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              setCompareMode((m) => !m);
              setCompareIds([]);
            }}
            className={
              compareMode
                ? "bg-brand-indigo text-cream-200 hover:bg-indigo-900"
                : "border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200"
            }
          >
            {compareMode ? "Cancel" : "Compare Homes"}
          </Button>
        )}
        {compareMode && compareIds.length === 2 && (
          <Button
            size="sm"
            className="bg-brand-saffron text-cream-200 hover:bg-saffron-600"
            onClick={() =>
              router.push(
                `/homes/compare?a=${compareIds[0]}&b=${compareIds[1]}`
              )
            }
          >
            Compare Selected →
          </Button>
        )}
        {compareMode && (
          <p className="font-body text-sm text-indigo-500">
            {compareIds.length === 0
              ? "Select 2 homes to compare"
              : compareIds.length === 1
              ? "Select 1 more home"
              : "Ready — click Compare Selected"}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homes.map((home) => {
          const selected = compareIds.includes(home.id);
          const dateStr = new Date(
            home.scoredAt ?? home.createdAt
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <Card
              key={home.id}
              className={`relative border-cream-300 transition-all ${
                compareMode
                  ? "cursor-pointer select-none"
                  : ""
              } ${selected ? "ring-2 ring-brand-saffron" : ""}`}
              onClick={compareMode ? () => toggleCompare(home.id) : undefined}
            >
              {compareMode && selected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-saffron">
                  <span className="font-body text-xs font-bold text-white">
                    {compareIds.indexOf(home.id) + 1}
                  </span>
                </div>
              )}

              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-snug">{home.label}</CardTitle>
                <p className="font-body text-xs text-indigo-400">{dateStr}</p>
              </CardHeader>

              <CardContent>
                <div className="mb-3 flex items-baseline gap-2">
                  {home.vaastuScore !== null ? (
                    <>
                      <span
                        className={`font-heading text-4xl font-semibold ${scoreColor(home.vaastuScore)}`}
                      >
                        {Math.round(home.vaastuScore)}
                      </span>
                      <span className="font-body text-xs text-indigo-400">/ 100</span>
                      <span className="ml-auto font-body text-xs font-semibold text-indigo-500">
                        {verdict(home.vaastuScore)}
                      </span>
                    </>
                  ) : (
                    <span className="font-body text-sm text-indigo-400">No score</span>
                  )}
                </div>

                {!compareMode && (
                  <div className="flex items-center gap-1">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200"
                    >
                      <Link href={`/homes/${home.id}`}>View →</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-indigo-500 hover:text-brand-indigo"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRename(home);
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(home.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renameId} onOpenChange={(open) => !open && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Home</DialogTitle>
            <DialogDescription>Enter a new name for this property.</DialogDescription>
          </DialogHeader>
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
            placeholder="e.g. My Flat, Pune"
            className="w-full rounded-md border border-indigo-200 bg-cream-200 px-3 py-2 font-body text-sm text-brand-indigo placeholder:text-indigo-300 focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>
              Cancel
            </Button>
            <Button
              disabled={renaming || !renameValue.trim()}
              onClick={handleRename}
              className="bg-brand-saffron text-cream-200 hover:bg-saffron-600 disabled:opacity-60"
            >
              {renaming ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this home?</DialogTitle>
            <DialogDescription>
              This will permanently remove the home and all its reports. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
