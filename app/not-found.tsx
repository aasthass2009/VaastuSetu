import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-cream-200 px-6 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-indigo">
        <span className="font-heading text-4xl font-semibold text-brand-saffron">404</span>
      </div>

      <h1 className="mb-3 font-heading text-4xl font-semibold text-brand-indigo md:text-5xl">
        Page not found
      </h1>
      <p className="mx-auto mb-10 max-w-md font-body text-base leading-relaxed text-indigo-700">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-cream-200">
          <Link href="/services">View services</Link>
        </Button>
      </div>
    </div>
  );
}
