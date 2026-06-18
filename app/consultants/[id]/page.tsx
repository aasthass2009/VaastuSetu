import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { BookingForm } from "./_components/booking-form";

type Ctx = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const { id } = await params;
  const c = await prisma.consultant.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  if (!c) return { title: "Consultant Not Found | VaastuSetu" };
  return {
    title: `Book ${c.user.name} — Vastu Consultant | VaastuSetu`,
    description: c.bio ?? undefined,
  };
}

export default async function ConsultantProfilePage({ params }: Ctx) {
  const { id } = await params;

  const [c, { userId: clerkId }] = await Promise.all([
    prisma.consultant.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    }),
    auth(),
  ]);

  if (!c) notFound();

  // Pre-fill form from Clerk if signed in
  let prefillName = "";
  let prefillEmail = "";
  if (clerkId) {
    const cu = await currentUser();
    prefillName = cu?.fullName ?? "";
    prefillEmail = cu?.emailAddresses[0]?.emailAddress ?? "";
  }

  const initials = (c.user.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen bg-cream-200">
      {/* Hero strip */}
      <div className="bg-brand-indigo px-6 py-12">
        <div className="mx-auto max-w-5xl flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 font-heading text-3xl font-semibold text-brand-gold ring-4 ring-brand-gold/30">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-semibold text-cream-200 md:text-4xl">
              {c.user.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-sm text-cream-300">
              {c.city && <span>{c.city}</span>}
              <span>{c.experienceYears} years experience</span>
              {c.ratingAvg && (
                <span className="text-brand-gold">
                  ★ {c.ratingAvg.toFixed(1)} ({c.ratingCount} reviews)
                </span>
              )}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-heading text-2xl font-semibold text-brand-saffron">
              ₹{(c.hourlyRateINR ?? 0).toLocaleString("en-IN")}
            </p>
            <p className="font-body text-sm text-cream-300">per hour</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl gap-10 px-6 py-12 lg:grid lg:grid-cols-[1fr_380px]">
        {/* Left: profile details */}
        <div className="mb-10 lg:mb-0">
          <section className="mb-8">
            <h2 className="mb-3 font-heading text-xl font-semibold text-brand-indigo">
              About
            </h2>
            <p className="font-body text-base leading-relaxed text-indigo-800">
              {c.bio}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-heading text-xl font-semibold text-brand-indigo">
              Specialisations
            </h2>
            <div className="flex flex-wrap gap-2">
              {c.specialisations.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-brand-indigo px-3 py-1 font-body text-sm text-cream-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-heading text-xl font-semibold text-brand-indigo">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {c.languages.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-cream-300 bg-white px-3 py-1 font-body text-sm text-indigo-700"
                >
                  {l}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold text-brand-indigo">
              What to expect
            </h2>
            <ul className="space-y-2">
              {[
                "60-minute video consultation via Google Meet or Zoom",
                "Personalised Vastu assessment based on your home's directions",
                "Practical, no-demolition remedies you can apply immediately",
                "Written session notes emailed within 24 hours",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 font-body text-sm text-indigo-800">
                  <span className="mt-0.5 shrink-0 text-brand-saffron">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right: booking form */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-heading text-xl font-semibold text-brand-indigo">
              Request a Consultation
            </h2>
            <BookingForm
              consultantId={c.id}
              consultantName={c.user.name ?? "Consultant"}
              hourlyRateINR={c.hourlyRateINR ?? 0}
              prefillName={prefillName}
              prefillEmail={prefillEmail}
              isLoggedIn={!!clerkId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
