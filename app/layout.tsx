import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { RegisterSW } from "@/components/pwa/register-sw";

export const viewport: Viewport = {
  themeColor: "#241B3A",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "VaastuSetu — Ancient Wisdom, Modern Spaces",
  description:
    "Authentic Vastu Shastra consultancy bridging ancient architectural wisdom with contemporary living.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VaastuSetu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body className="flex min-h-screen flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-saffron focus:px-4 focus:py-2 focus:text-cream-200 focus:outline-none"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <RegisterSW />
        </body>
      </html>
    </ClerkProvider>
  );
}
