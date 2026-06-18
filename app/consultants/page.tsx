import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vastu Consultants — Book a 1-on-1 Session | VaastuSetu",
  description:
    "Browse verified Vastu Shastra consultants with published credentials, experience, and pricing. Book a video consultation online.",
};

function StarRating({ avg, count }: { avg: number; count: number }) {
  const full = Math.floor(avg);
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            fill={i <= full ? "#B8860B" : "none"}
            stroke="#B8860B"
            strokeWidth={1.5}
            className="h-3.5 w-3.5"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="font-body text-xs text-indigo-500">
        {avg.toFixed(1)} ({count})
      </span>
    </span>
  );
}

export default async function ConsultantsPage() {
  const consultants = await prisma.consultant.findMany({
    where: { isAvailable: true },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { ratingAvg: "desc" },
  });

  return (
    <div className="bg-cream-200">
      {/* Hero */}
      <section className="bg-brand-indigo px-4 py-14 text-center sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            Expert Guidance
          </p>
          <h1 className="mb-5 font-heading text-4xl font-semibold text-cream-200 sm:text-5xl md:text-6xl">
            Our Consultants
          </h1>
          <p className="font-body text-lg leading-relaxed text-cream-300">
            Verified Vastu Shastra practitioners with published credentials.
            Book a 1-on-1 video session and get personalised guidance for your
            home or workspace.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          {consultants.length === 0 ? (
            <p className="text-center font-body text-base text-indigo-500">
              No consultants available right now. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {consultants.map((c) => {
                const initials = (c.user.name ?? "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("");
                return (
                  <div
                    key={c.id}
                    className="flex flex-col rounded-2xl border border-cream-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Top row */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-indigo font-heading text-xl font-semibold text-brand-gold">
                        {initials}
                      </div>

                      {/* Name + meta */}
                      <div className="min-w-0 flex-1">
                        <h2 className="font-heading text-lg font-semibold leading-tight text-brand-indigo">
                          {c.user.name}
                        </h2>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {c.city && (
                            <span className="flex items-center gap-1 font-body text-xs text-indigo-500">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433 5.737 5.737 0 00.28.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                              </svg>
                              {c.city}
                            </span>
                          )}
                          <span className="font-body text-xs text-indigo-500">
                            {c.experienceYears} yrs exp
                          </span>
                        </div>
                        {c.ratingAvg && (
                          <div className="mt-1">
                            <StarRating avg={c.ratingAvg} count={c.ratingCount} />
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <p className="font-heading text-lg font-semibold text-brand-saffron">
                          ₹{(c.hourlyRateINR ?? 0).toLocaleString("en-IN")}
                        </p>
                        <p className="font-body text-xs text-indigo-400">/hour</p>
                      </div>
                    </div>

                    {/* Specialisations */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.specialisations.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-cream-300 px-2.5 py-0.5 font-body text-xs text-indigo-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Languages */}
                    <p className="mt-2 font-body text-xs text-indigo-400">
                      {c.languages.join(" · ")}
                    </p>

                    {/* Bio */}
                    <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-indigo-700">
                      {c.bio}
                    </p>

                    {/* CTA */}
                    <div className="mt-5 flex items-center gap-3">
                      <Button asChild className="flex-1">
                        <Link href={`/consultants/${c.id}`}>
                          Book Consultation
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-brand-indigo px-4 py-10 text-center sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 font-body text-sm font-medium uppercase tracking-widest text-brand-gold">
            How it works
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Pick a consultant", desc: "Browse by specialisation, language, or city." },
              { step: "02", title: "Choose a time slot", desc: "Select a date and time that works for you." },
              { step: "03", title: "Get your consultation", desc: "Video call + written session notes emailed after." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <p className="mb-1 font-heading text-3xl font-semibold text-brand-gold/40">{item.step}</p>
                <h3 className="mb-1 font-heading text-base font-semibold text-cream-200">{item.title}</h3>
                <p className="font-body text-sm text-cream-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
