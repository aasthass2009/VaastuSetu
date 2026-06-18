import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-cream-200 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-semibold text-brand-indigo">
            Create your account
          </h1>
          <p className="mt-2 font-body text-sm text-indigo-600">
            Join VaastuSetu and bring harmony to your space
          </p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#C05A12",
              colorBackground: "#FBF5EA",
              colorInputBackground: "#ffffff",
              colorText: "#241B3A",
              colorTextSecondary: "#4a4060",
              colorInputText: "#241B3A",
              borderRadius: "0.5rem",
              fontFamily: "Inter, system-ui, sans-serif",
            },
            elements: {
              card: "shadow-md border border-cream-300",
              headerTitle: "font-heading text-brand-indigo",
              headerSubtitle: "font-body text-indigo-600",
              socialButtonsBlockButton:
                "border border-cream-300 hover:border-brand-saffron hover:bg-saffron-50 transition-colors",
              formButtonPrimary:
                "bg-brand-saffron hover:bg-saffron-600 font-body",
              footerActionLink: "text-brand-saffron hover:text-saffron-600",
              identityPreviewEditButton: "text-brand-saffron",
            },
          }}
        />
      </div>
    </section>
  );
}
