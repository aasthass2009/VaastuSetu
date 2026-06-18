export default function Footer() {
  return (
    <footer className="border-t border-cream-300 bg-brand-indigo py-8 text-cream-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-heading text-lg font-semibold text-cream-200">
            Vaastu<span className="text-brand-saffron">Setu</span>
          </p>

          <p className="max-w-xl text-center text-xs font-body leading-relaxed text-cream-400 md:text-right">
            Disclaimer: VaastuSetu provides consultancy based on traditional
            Vastu Shastra principles for informational purposes only. Results
            may vary. Content does not constitute professional architectural,
            legal, or medical advice. &copy; {new Date().getFullYear()} VaastuSetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
