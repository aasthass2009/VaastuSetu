import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu Compass — Find Your Home's Direction | VaastuSetu",
  description:
    "Use your phone's compass to find the exact facing direction of your home for an accurate Vastu Score.",
};

export default function CompassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
