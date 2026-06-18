import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: { feature?: string };
}

export default function ComingSoonPage({ searchParams }: Props) {
  const feature = searchParams.feature ?? "This feature";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-cream-200 px-6 py-20 text-center">
      {/* Ornament */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-indigo">
        <span className="font-heading text-3xl text-brand-gold">✦</span>
      </div>

      <p className="mb-2 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-saffron">
        Coming Soon
      </p>

      <h1 className="mb-4 font-heading text-4xl font-semibold text-brand-indigo md:text-5xl">
        {feature}
      </h1>

      <p className="mx-auto mb-10 max-w-md font-body text-base leading-relaxed text-indigo-700">
        We&apos;re working hard to bring this to life. Sign up for a free
        account and we&apos;ll notify you the moment it&apos;s ready.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/sign-up">Notify me when it&apos;s ready</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
          <Link href="/services">← Back to services</Link>
        </Button>
      </div>
    </div>
  );
}
