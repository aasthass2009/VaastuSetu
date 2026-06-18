import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "vaastu-score",
    icon: "📊",
    badge: "Coming soon",
    title: "Vastu Score",
    tagline: "Know your home's energy at a glance.",
    description:
      "Upload your floor plan and answer a few questions about your plot orientation. Our AI engine analyses room placement, entry points, and directional alignment against classical Vastu principles to produce a 0–100 score with a zone-by-zone breakdown.",
    features: [
      "Instant score from a floor plan or room sketch",
      "Zone-by-zone analysis (bedroom, kitchen, puja, entrance)",
      "Prioritised list of easy and structural remedies",
      "Download a shareable PDF report",
    ],
    cta: { label: "Join the waitlist", href: "/coming-soon?feature=Vastu+Score" },
    accent: "bg-brand-indigo",
  },
  {
    id: "reports",
    icon: "📄",
    badge: "Coming soon",
    title: "Detailed Vastu Reports",
    tagline: "Expert-written, room-by-room guidance.",
    description:
      "Go beyond a score. Our certified consultants review your property in detail and produce a comprehensive written report covering every aspect of your space — from main entrance auspiciousness to underground water placement.",
    features: [
      "Reviewed and signed off by a certified consultant",
      "Remedies that don't require demolition",
      "Suggested colour palettes, materials, and décor placement",
      "Follow-up Q&A session included",
    ],
    cta: { label: "Join the waitlist", href: "/coming-soon?feature=Vastu+Reports" },
    accent: "bg-brand-saffron",
  },
  {
    id: "consultants",
    icon: "🧑‍💼",
    badge: "Available",
    title: "Consultant Bookings",
    tagline: "Talk to a verified Vastu expert, 1-on-1.",
    description:
      "Browse profiles of our verified Vastu consultants, each with published specialisations, languages, and experience years. Book a video session at a time that suits you — no middlemen, no opaque pricing.",
    features: [
      "Verified consultants with published credentials",
      "Residential, commercial, and heritage specialists",
      "Languages: English, Hindi, Tamil, Kannada, Malayalam, Marathi",
      "Secure video call + session notes emailed after",
    ],
    cta: { label: "Browse consultants", href: "/coming-soon?feature=Consultant+Bookings" },
    accent: "bg-brand-indigo",
  },
  {
    id: "ai-plans",
    icon: "🤖",
    badge: "Coming soon",
    title: "AI Vastu Home Plans",
    tagline: "Let AI design a Vastu-compliant layout for you.",
    description:
      "Describe your plot dimensions, facing direction, and family composition. Our AI planner — trained on thousands of approved Vastu layouts — generates an optimised room arrangement that satisfies classical Vastu rules and your practical requirements.",
    features: [
      "Generates multiple layout options to compare",
      "Respects your budget and structural constraints",
      "Exportable as a PDF floor-plan sketch",
      "Works for new construction and renovations",
    ],
    cta: { label: "Join the waitlist", href: "/coming-soon?feature=AI+Home+Plans" },
    accent: "bg-gold-600",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-cream-200">

      {/* Hero */}
      <section className="bg-brand-indigo px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            What We Offer
          </p>
          <h1 className="mb-5 font-heading text-5xl font-semibold text-cream-200 md:text-6xl">
            Our Services
          </h1>
          <p className="font-body text-lg leading-relaxed text-cream-300">
            From a quick automated score to a full expert consultation — choose
            the level of guidance that fits your needs.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-16">
          {services.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className={`flex flex-col gap-10 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Icon panel */}
              <div className={`flex w-full shrink-0 items-center justify-center rounded-2xl ${s.accent} py-16 md:w-56`}>
                <span className="text-6xl">{s.icon}</span>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center">
                <div className="mb-2 flex items-center gap-3">
                  <span className={`inline-block rounded-full px-3 py-0.5 font-body text-xs font-semibold uppercase tracking-wider ${
                    s.badge === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-cream-300 text-indigo-600"
                  }`}>
                    {s.badge}
                  </span>
                </div>
                <h2 className="mb-1 font-heading text-3xl font-semibold text-brand-indigo">
                  {s.title}
                </h2>
                <p className="mb-3 font-body text-base font-medium text-brand-saffron">
                  {s.tagline}
                </p>
                <p className="mb-5 font-body text-base leading-relaxed text-indigo-800">
                  {s.description}
                </p>
                <ul className="mb-6 space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-body text-sm text-indigo-700">
                      <span className="mt-0.5 text-brand-saffron">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div>
                  <Button asChild>
                    <Link href={s.cta.href}>{s.cta.label}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-indigo px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-heading text-3xl font-semibold text-cream-200">
            Not sure where to start?
          </h2>
          <p className="mb-8 font-body text-base text-cream-300">
            Create a free account and we&apos;ll help you figure out which
            service is right for your situation.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-brand-saffron hover:bg-saffron-600">
              <Link href="/sign-up">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cream-300 text-cream-200 hover:bg-cream-200/10 hover:text-cream-200">
              <Link href="/about">Learn about us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
