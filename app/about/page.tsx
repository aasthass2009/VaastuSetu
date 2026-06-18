import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About VaastuSetu — Authentic, Affordable Vastu for Everyone",
  description:
    "VaastuSetu's mission: authentic Vastu Shastra guidance for every household in India and abroad, with no-demolition remedies and respectful, tradition-rooted advice.",
};

const values = [
  {
    icon: "🌿",
    title: "Authentic",
    body: "Every recommendation is rooted in classical Vastu Shastra texts — not trend-driven shortcuts. Our consultants study original Sanskrit treatises alongside modern architectural practice.",
  },
  {
    icon: "💡",
    title: "Simple",
    body: "Ancient wisdom shouldn't need a decoder ring. We translate complex directional principles into plain-language guidance that homeowners and builders can act on immediately.",
  },
  {
    icon: "🤝",
    title: "Affordable",
    body: "Premium Vastu advice has historically been gatekept behind high fees. We use technology to make expert-level analysis accessible to every household, not just a privileged few.",
  },
  {
    icon: "🌏",
    title: "Trustworthy",
    body: "We surface verified consultants, publish transparent scoring rubrics, and never recommend changes just to justify a fee. Your trust is the foundation of everything we build.",
  },
];

const team = [
  {
    name: "Priya Menon",
    role: "Co-founder & Head of Vastu",
    bio: "15 years practising Vastu Shastra in Kerala and Bangalore. Trained in both Thachu Shastra and the Manasara tradition.",
  },
  {
    name: "Aryan Kapoor",
    role: "Co-founder & CEO",
    bio: "Former product lead at a proptech startup. Combines deep respect for Vedic systems with a drive to make them scale.",
  },
  {
    name: "Deepa Rao",
    role: "Head of Technology",
    bio: "ML engineer who spent five years building AI scoring systems. Now applies the same rigour to traditional knowledge systems.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream-200">

      {/* Hero */}
      <section className="bg-brand-indigo px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            Our Mission
          </p>
          <h1 className="mb-6 font-heading text-5xl font-semibold leading-tight text-cream-200 md:text-6xl">
            Making Vastu{" "}
            <span className="text-brand-saffron">Simple, Affordable</span>{" "}
            and Trustworthy
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-cream-300">
            Millions of families across India and the world believe in the
            transformative power of Vastu Shastra — but finding genuine,
            affordable guidance has always been difficult. VaastuSetu exists
            to change that.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-cream-300" />
            <span className="font-heading text-xl text-brand-gold">✦</span>
            <div className="h-px flex-1 bg-cream-300" />
          </div>

          <h2 className="mb-6 font-heading text-3xl font-semibold text-brand-indigo md:text-4xl">
            The Bridge We&apos;re Building
          </h2>
          <div className="space-y-5 font-body text-base leading-relaxed text-indigo-800">
            <p>
              Vastu Shastra is one of humanity&apos;s oldest systems of
              conscious architecture. Developed over millennia in the Indian
              subcontinent, it codifies how the orientation of a building, the
              placement of rooms, and the flow of light and air affect the
              people living within it.
            </p>
            <p>
              For generations, this knowledge lived with a small community of
              practitioners — passed down through gurukul lineages, often
              inaccessible to ordinary families and nearly impossible to verify.
              The internet brought information, but not clarity. Today you can
              read a hundred conflicting articles about which direction your
              kitchen should face, and still not know who to trust.
            </p>
            <p>
              <strong className="text-brand-indigo">VaastuSetu is the bridge.</strong>{" "}
              We combine verified Vastu expertise with modern technology to
              give every household — whether in Pune, London, or Toronto — access
              to clear, actionable, affordable guidance rooted in authentic
              tradition.
            </p>
            <p>
              We are not here to replace your local pandit or your family&apos;s
              wisdom. We are here to help you find the right experts, understand
              their advice, and act on it with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-indigo px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-heading text-3xl font-semibold text-cream-200 md:text-4xl">
            What We Stand For
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <span className="mb-3 block text-3xl">{v.icon}</span>
                <h3 className="mb-2 font-heading text-xl font-semibold text-cream-200">
                  {v.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-cream-300">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-heading text-3xl font-semibold text-brand-indigo md:text-4xl">
            The People Behind VaastuSetu
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map((person) => (
              <div key={person.name} className="rounded-xl border border-cream-300 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-indigo font-heading text-2xl font-semibold text-brand-gold">
                  {person.name.charAt(0)}
                </div>
                <h3 className="font-heading text-lg font-semibold text-brand-indigo">
                  {person.name}
                </h3>
                <p className="mb-3 font-body text-xs font-medium uppercase tracking-wider text-brand-saffron">
                  {person.role}
                </p>
                <p className="font-body text-sm leading-relaxed text-indigo-700">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-300 px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-heading text-3xl font-semibold text-brand-indigo">
            Ready to begin?
          </h2>
          <p className="mb-8 font-body text-base text-indigo-700">
            Explore our services or create a free account to get your first
            Vastu score in minutes.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-up">Create free account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
