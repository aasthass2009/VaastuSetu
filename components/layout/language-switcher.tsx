"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Defer locale-dependent active state to after mount so the first render
  // is identical on server and client, preventing hydration mismatches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  async function switchTo(next: string) {
    if (next === locale || isPending) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => router.refresh());
  }

  // Before mount: no active locale → both buttons use inactive style.
  // After mount: show the real active locale.
  const activeLocale = mounted ? locale : null;

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-white/20 p-0.5">
      {(["en", "hi"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-label={loc === "en" ? "Switch to English" : "हिन्दी में बदलें"}
          className={[
            "rounded px-2 py-0.5 font-body text-xs font-medium transition-colors disabled:opacity-60",
            activeLocale === loc
              ? "bg-brand-saffron text-cream-200"
              : "text-cream-300 hover:text-cream-200",
          ].join(" ")}
        >
          {loc === "en" ? "EN" : "हिन्दी"}
        </button>
      ))}
    </div>
  );
}
