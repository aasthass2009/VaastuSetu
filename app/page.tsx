import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage() {
  const t = await getTranslations();

  const features = [
    {
      title: t("services.items.home.title"),
      description: t("services.items.home.description"),
      icon: "🏠",
      href: "/services#vaastu-score",
    },
    {
      title: t("services.items.office.title"),
      description: t("services.items.office.description"),
      icon: "🏢",
      href: "/services#reports",
    },
    {
      title: t("services.items.plot.title"),
      description: t("services.items.plot.description"),
      icon: "📐",
      href: "/services#consultants",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-indigo px-4 py-16 text-center sm:px-6 md:py-32">
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
            {t("hero.tagline")}
          </p>
          <h1 className="mb-6 font-heading text-4xl font-semibold leading-tight text-cream-200 sm:text-5xl md:text-7xl">
            {t("hero.title")}{" "}
            <span className="text-brand-saffron">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl font-body text-base leading-relaxed text-cream-300 sm:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[180px] text-base">
              <Link href="/vaastu-score">{t("hero.ctaPrimary")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[180px] border-cream-300 text-base text-cream-200 hover:bg-cream-200/10 hover:text-cream-200"
            >
              <Link href="/about">{t("hero.ctaSecondary")}</Link>
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
      <section className="bg-cream-200 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-heading text-3xl font-semibold text-brand-indigo sm:text-4xl md:text-5xl">
              {t("services.heading")}
            </h2>
            <p className="mx-auto max-w-lg font-body text-base text-indigo-700">
              {t("services.subtitle")}
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
                    <Link href={feature.href}>{t("services.learnMore")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
              <Link href="/services">{t("services.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-saffron px-4 py-10 text-center sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-cream-200 sm:text-3xl md:text-4xl">
            {t("cta.heading")}
          </h2>
          <p className="mb-8 font-body text-base text-cream-300">
            {t("cta.subtitle")}
          </p>
          <Button
            asChild
            size="lg"
            className="border-cream-200 bg-cream-200 text-brand-saffron hover:bg-cream-100 hover:text-brand-saffron"
          >
            <Link href="/sign-up">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
