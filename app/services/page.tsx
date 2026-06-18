import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services — Vastu Score, Reports & Consultations | VaastuSetu",
  description:
    "Free Vastu Score with downloadable PDF report, AI-powered Vastu chatbot, and expert consultant bookings — all on VaastuSetu.",
};

const LIVE_BADGE = "bg-green-100 text-green-700 border border-green-200";
const SOON_BADGE = "bg-cream-300 text-indigo-600 border border-cream-400";

const services = [
  {
    id: "vaastu-score",
    icon: "📊",
    badge: "Live",
    badgeClass: LIVE_BADGE,
    title: "Vastu Score",
    tagline: "Know your home's energy at a glance.",
    description:
      "Answer a few questions about your home's room directions and entry point. Our scoring engine — built on classical Vastu rules — produces a 0–100 score with a room-by-room breakdown, verdict, and prioritised remedy list. No floor plan needed.",
    features: [
      "Instant score — takes under 5 minutes",
      "Covers 6 key rooms: entrance, kitchen, bedroom, pooja, bathroom, living room",
      "Verdict and zone-by-zone analysis",
      "Save and revisit your homes from your dashboard",
    ],
    cta: { label: "Get your free Vastu Score →", href: "/vaastu-score" },
    flip: false,
  },
  {
    id: "reports",
    icon: "📄",
    badge: "Live",
    badgeClass: LIVE_BADGE,
    title: "Downloadable PDF Reports",
    tagline: "A beautifully formatted report for every scored home.",
    description:
      "Once you score a home, download a branded PDF report you can save, share, or hand to a contractor or interior designer. The report includes your score, verdict, a full room-by-room breakdown, and practical no-demolition remedies for each zone.",
    features: [
      "Professional branded PDF in A4 format",
      "Full room-by-room findings with tier badges and remedies",
      "No sign-up needed to score; sign in to save and re-download",
      "Available from your dashboard or the score result page",
    ],
    cta: { label: "Score your home and download →", href: "/vaastu-score" },
    flip: true,
  },
  {
    id: "ai-chatbot",
    icon: "🤖",
    badge: "Live",
    badgeClass: LIVE_BADGE,
    title: "AI Vastu Guru Chatbot",
    tagline: "Ask anything about Vastu — get a personalised answer instantly.",
    description:
      "Our AI Vastu Guru is available on every page via the chat button in the bottom-right corner. It draws on a curated Vastu knowledge base to answer questions about directions, room placement, remedies, and the five elements. No sign-in required.",
    features: [
      "Available on every page — no navigation needed",
      "Powered by a curated Vastu Shastra knowledge base",
      "Warm, practical answers with no-demolition remedies",
      "Works anonymously — no account required",
    ],
    cta: { label: "Try the chat widget ↘", href: "#" },
    flip: false,
  },
  {
    id: "floor-plan",
    icon: "📐",
    badge: "Coming soon",
    badgeClass: SOON_BADGE,
    title: "Floor-Plan Analysis",
    tagline: "Upload a plan — get a detailed directional audit.",
    description:
      "Upload your architectural floor plan and our system will automatically identify room positions, calculate directional alignments, flag defects, and generate a comprehensive zone-by-zone report — all without a consultant call.",
    features: [
      "Supports JPG, PNG, and PDF floor plans",
      "Automatic room detection and compass mapping",
      "Detailed written report with severity ratings",
      "Suitable for existing homes and new constructions",
    ],
    cta: {
      label: "Join the waitlist",
      href: "/coming-soon?feature=Floor-Plan+Analysis",
    },
    flip: true,
  },
  {
    id: "home-plans",
    icon: "✏️",
    badge: "Coming soon",
    badgeClass: SOON_BADGE,
    title: "Vastu Home-Plan Generator",
    tagline: "Let AI design a Vastu-compliant layout for you.",
    description:
      "Describe your plot dimensions, facing direction, and family size. Our AI planner generates an optimised room arrangement that satisfies classical Vastu guidelines alongside your practical requirements — exportable as a PDF sketch.",
    features: [
      "Multiple layout options to compare",
      "Respects plot shape, budget, and structural constraints",
      "Works for new construction and renovations",
      "Exportable PDF sketch to share with your architect",
    ],
    cta: {
      label: "Join the waitlist",
      href: "/coming-soon?feature=Home+Plan+Generator",
    },
    flip: false,
  },
  {
    id: "consultants",
    icon: "🧑‍💼",
    badge: "Coming soon",
    badgeClass: SOON_BADGE,
    title: "Consultant Bookings",
    tagline: "Talk to a verified Vastu expert, 1-on-1.",
    description:
      "Browse profiles of verified Vastu consultants with published specialisations, experience years, and languages. Book a video session at a time that suits you — no middlemen, no opaque pricing.",
    features: [
      "Verified consultants with published credentials",
      "Residential, commercial, and heritage specialists",
      "Languages: English, Hindi, Tamil, Kannada, Malayalam, Marathi",
      "Secure video call + session notes emailed after",
    ],
    cta: {
      label: "Join the waitlist",
      href: "/coming-soon?feature=Consultant+Bookings",
    },
    flip: true,
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
            From a free automated score to a full expert consultation — choose
            the level of guidance that fits your needs.
          </p>
        </div>
      </section>

      {/* Service list */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-16">
          {services.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className={`flex flex-col gap-10 md:flex-row ${s.flip ? "md:flex-row-reverse" : ""}`}
            >
              {/* Icon panel */}
              <div className="flex w-full shrink-0 items-center justify-center rounded-2xl bg-brand-indigo py-16 md:w-52">
                <span className="text-6xl" aria-hidden>
                  {s.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center">
                <div className="mb-2">
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 font-body text-xs font-semibold uppercase tracking-wider ${s.badgeClass}`}
                  >
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
                    <li
                      key={f}
                      className="flex items-start gap-2 font-body text-sm text-indigo-700"
                    >
                      <span className="mt-0.5 shrink-0 text-brand-saffron">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div>
                  {s.badge === "Live" ? (
                    <Button asChild>
                      <Link href={s.cta.href}>{s.cta.label}</Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200"
                    >
                      <Link href={s.cta.href}>{s.cta.label}</Link>
                    </Button>
                  )}
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
            Create a free account and get your Vastu Score in under five
            minutes — no floor plan required.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-brand-saffron hover:bg-saffron-600"
            >
              <Link href="/sign-up">Get started free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream-300 text-cream-200 hover:bg-cream-200/10 hover:text-cream-200"
            >
              <Link href="/room-guides">Browse room guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
