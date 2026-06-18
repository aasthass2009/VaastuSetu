import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Home Vastu Analysis",
    description:
      "Comprehensive directional audit of your home to align energy flow with the five elements.",
    icon: "🏠",
    href: "/services#vaastu-score",
  },
  {
    title: "Office & Commercial",
    description:
      "Optimise workspace layout to foster productivity, prosperity, and harmony among colleagues.",
    icon: "🏢",
    href: "/services#reports",
  },
  {
    title: "Plot & Construction",
    description:
      "Evaluate land orientation and construction plans before breaking ground for lasting positive energy.",
    icon: "📐",
    href: "/services#consultants",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-indigo px-6 py-24 text-center md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #B8860B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C05A12 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            Ancient Wisdom · Modern Living
          </p>
          <h1 className="mb-6 font-heading text-5xl font-semibold leading-tight text-cream-200 md:text-7xl">
            Harmonise Your Space with{" "}
            <span className="text-brand-saffron">Vastu</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl font-body text-lg leading-relaxed text-cream-300">
            VaastuSetu bridges five-thousand-year-old Vedic architectural
            principles with contemporary design — helping you create spaces
            that nurture well-being, abundance, and peace.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[180px] text-base">
              <Link href="/sign-up">Book a Consultation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[180px] border-cream-300 text-base text-cream-200 hover:bg-cream-200/10 hover:text-cream-200"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 bg-brand-indigo py-6">
        <div className="h-px w-24 bg-brand-gold/40" />
        <span className="font-heading text-xl text-brand-gold">✦</span>
        <div className="h-px w-24 bg-brand-gold/40" />
      </div>

      {/* Services preview */}
      <section className="bg-cream-200 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-heading text-4xl font-semibold text-brand-indigo md:text-5xl">
              Our Services
            </h2>
            <p className="mx-auto max-w-lg font-body text-base text-indigo-700">
              Tailored Vastu consultancy for every stage of your journey — from
              choosing land to refining your living space.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-cream-300 bg-white transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <span className="mb-2 text-3xl" aria-hidden>
                    {feature.icon}
                  </span>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 text-brand-saffron group-hover:underline"
                  >
                    <Link href={feature.href}>Learn more →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
              <Link href="/services">View all services →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-saffron px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-heading text-3xl font-semibold text-cream-200 md:text-4xl">
            Ready to Transform Your Space?
          </h2>
          <p className="mb-8 font-body text-base text-cream-300">
            Speak with a certified Vastu consultant today and take the first
            step toward a harmonious home.
          </p>
          <Button
            asChild
            size="lg"
            className="border-cream-200 bg-cream-200 text-brand-saffron hover:bg-cream-100 hover:text-brand-saffron"
          >
            <Link href="/sign-up">Schedule Your Free Call</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
