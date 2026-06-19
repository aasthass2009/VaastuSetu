import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vastu FAQ — Common Questions Answered | VaastuSetu",
  description:
    "Answers to the most common Vastu Shastra questions: do you need to break walls, how it differs from Feng Shui, whether it works for NRIs, and more.",
};

// English answers (detailed Vastu prose stays in English for accuracy)
const FAQ_ANSWERS = [
  "No. The vast majority of Vastu corrections can be made without any structural changes. Remedial Vastu uses energy tools — crystals, plants, specific colours, sea salt bowls, mirrors, yantras, and light placement — to rebalance the directional energy of a space. Demolition is never the first resort, and at VaastuSetu we specifically focus on no-demolition remedies that any homeowner or tenant can apply immediately.",
  "Yes. Vastu Shastra is based on the cardinal directions (North, South, East, West) and the five elements (Pancha Bhuta) — principles that are universal, not geography-specific. The sun still rises in the east; the earth's magnetic poles still run north–south. The same directional guidelines apply whether you live in Mumbai, Toronto, or Melbourne. Many NRI families and international clients find Vastu just as relevant abroad as they would at home in India.",
  "Both are ancient systems of harmonious spatial design, but they come from different civilisational traditions and use distinct frameworks. Vastu Shastra originated in the Indian Vedic tradition and is rooted in the Pancha Bhuta (five elements), the Ashta Disha (eight directions), and the Vaastu Purusha Mandala (cosmic energy grid). Feng Shui emerged from Taoist philosophy in China and works with concepts like Qi, Yin and Yang, and the Bagua map. The two systems sometimes reach similar conclusions (both value north-east for spiritual activity, for example) but the underlying frameworks and specific guidance differ meaningfully.",
  "No. Our Vastu Score tool works from a simple directional questionnaire — you tell us which direction each room is located in relative to the compass, and we calculate your score. You don't need an architectural drawing. However, if you do have a floor plan, it makes the analysis more precise. You can sketch a rough layout on paper, photograph it, or describe the directions room by room. Our AI chatbot can also walk you through the questionnaire conversationally.",
  "Vastu Shastra is a classical Indian system of architecture and spatial design, developed over thousands of years through empirical observation of how directional energy, sunlight, airflow, and element balance affect the people in a space. It is not a scientific discipline in the modern experimental sense, and VaastuSetu does not claim otherwise. We present Vastu as a respected, living tradition practised by millions of families, with practical value in thoughtful space design. Whether you approach it as spiritual tradition, ancient ecological wisdom, or psychological ritual, many people find that following its principles genuinely improves how their spaces feel.",
  "Not at all. A south-facing entrance is challenging in Vastu, but it is one of the most common configurations in Indian cities, and there are well-established remedies for it. These include placing a Vastu pyramid above the door frame, installing bright warm lighting at the entrance, adding a brass Ganesha or nameplate facing inward, and keeping the entrance meticulously clean and well-maintained. A south entrance with strong remedies is significantly better than an ignored one. Get your Vastu Score to see exactly what remedies are recommended for your specific home.",
  "Absolutely. Most Vastu recommendations are non-structural — they involve furniture placement, colours, plants, crystals, and light. All of these are renter-friendly. You can rearrange furniture to improve sleeping direction, add plants in the north or north-east, place a salt bowl in the toilet, adjust lighting, and use mirrors strategically. Renters can apply 80–90% of Vastu remedies without touching a wall.",
  "The simplest method is to use a compass app on your smartphone — stand in the centre of your home and note which direction is north. From there, you can map out where each room falls relative to the eight cardinal directions. If you know which direction your main entrance faces, you can work outward from there. Our Vastu Score questionnaire walks you through exactly this process, one room at a time.",
  "A full Vastu assessment is typically done once when you move in or make major changes (renovation, adding a room, changing room functions). After that, an annual check is useful to see if new furniture, changes in family composition, or room repurposing have introduced any Vastu imbalances. Our free score tool makes it easy to re-run an assessment whenever you want. Many families also re-assess after a major life event — marriage, a new child, a career change — when energy alignment is especially important.",
  "If you want to prioritise: (1) Sleeping direction — head pointing south is the single change most people notice immediately in their sleep quality. (2) Main entrance — keep it bright, clean, and clutter-free. (3) Kitchen cooking direction — face east while cooking when possible. (4) North-east zone — keep it light, clean, and free of toilets or heavy storage. These four account for the majority of Vastu's influence on daily life. Our score report ranks your home's zones by priority so you always know what to fix first.",
];

export default async function FAQPage() {
  const t = await getTranslations("faq");
  // Questions are translated; answers remain in English for accuracy
  const questions = t.raw("questions") as string[];

  return (
    <div className="bg-cream-200">
      {/* Hero */}
      <section className="bg-brand-indigo px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            {t("tagline")}
          </p>
          <h1 className="mb-5 font-heading text-5xl font-semibold leading-tight text-cream-200 md:text-6xl">
            {t("title")}
          </h1>
          <p className="font-body text-lg leading-relaxed text-cream-300">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {questions.map((question, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-cream-300 bg-white open:shadow-md transition-shadow"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-5 select-none">
                <h2 className="font-heading text-base font-semibold leading-snug text-brand-indigo md:text-lg">
                  {question}
                </h2>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400 transition-transform duration-200 group-open:rotate-180"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="border-t border-cream-300 px-6 pb-5 pt-4">
                <p className="font-body text-sm leading-relaxed text-indigo-800">
                  {FAQ_ANSWERS[i]}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Still have questions banner */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-brand-indigo px-8 py-10 text-center">
          <p className="mb-2 font-body text-sm font-medium uppercase tracking-widest text-brand-gold">
            {t("stillHaveQuestions")}
          </p>
          <h3 className="mb-4 font-heading text-2xl font-semibold text-cream-200">
            {t("aiGuruHeading")}
          </h3>
          <p className="mb-6 font-body text-sm leading-relaxed text-cream-300">
            {t("aiGuruDesc")}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-brand-saffron hover:bg-saffron-600"
            >
              <Link href="/vaastu-score">{t("ctaPrimary")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream-300 text-cream-200 hover:bg-cream-200/10 hover:text-cream-200"
            >
              <Link href="/room-guides">{t("ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
