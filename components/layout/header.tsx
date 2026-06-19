"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Settings, X, Receipt, ShieldCheck } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { label: t("home"),        href: "/" },
    { label: t("vaastuScore"), href: "/vaastu-score" },
    { label: t("roomGuides"),  href: "/room-guides" },
    { label: t("consultants"), href: "/consultants" },
    { label: t("compass"),     href: "/compass" },
  ];

  function navClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return [
      "font-body text-sm transition-colors",
      active ? "text-brand-gold" : "text-cream-300 hover:text-brand-gold",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-brand-indigo/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1" onClick={() => setMobileOpen(false)}>
          <span className="font-heading text-2xl font-semibold tracking-wide text-cream-200">Vaastu</span>
          <span className="font-heading text-2xl font-semibold tracking-wide text-brand-saffron">Setu</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex lg:gap-6">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={navClass(href)}>
              {label}
            </Link>
          ))}
          <Show when="signed-in">
            <Link href="/dashboard" className={navClass("/dashboard")}>
              {t("dashboard")}
            </Link>
          </Show>
        </nav>

        {/* Desktop auth + language */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="font-body text-sm text-cream-300 transition-colors hover:text-brand-gold">
                {t("signIn")}
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="rounded-md bg-brand-saffron px-4 py-1.5 font-body text-sm font-medium text-cream-200 transition-colors hover:bg-saffron-600">
                {t("getStarted")}
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-2 ring-brand-saffron ring-offset-2 ring-offset-brand-indigo",
                  userButtonPopoverCard: "border border-cream-300 shadow-lg",
                  userButtonPopoverActionButton: "hover:bg-saffron-50 font-body",
                  userButtonPopoverActionButtonText: "text-brand-indigo font-body",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label={t("profile")}
                  labelIcon={<Settings className="h-4 w-4" />}
                  href="/profile"
                />
                <UserButton.Link
                  label={t("billing")}
                  labelIcon={<Receipt className="h-4 w-4" />}
                  href="/billing"
                />
                <UserButton.Link
                  label={t("adminDashboard")}
                  labelIcon={<ShieldCheck className="h-4 w-4" />}
                  href="/admin"
                />
              </UserButton.MenuItems>
            </UserButton>
          </Show>
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Show when="signed-out">
            <SignUpButton mode="redirect">
              <button className="rounded-md bg-brand-saffron px-3 py-1 font-body text-xs font-medium text-cream-200">
                {t("getStarted")}
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { avatarBox: "h-7 w-7 ring-2 ring-brand-saffron ring-offset-1 ring-offset-brand-indigo" } }} />
          </Show>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-md text-cream-300 hover:text-cream-200"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-brand-indigo px-4 py-4 sm:px-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={navClass(href) + " block text-base"}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <Show when="signed-in">
              <li>
                <Link href="/dashboard" className={navClass("/dashboard") + " block text-base"} onClick={() => setMobileOpen(false)}>
                  {t("dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/profile" className={navClass("/profile") + " block text-base"} onClick={() => setMobileOpen(false)}>
                  {t("profile")}
                </Link>
              </li>
              <li>
                <Link href="/billing" className={navClass("/billing") + " block text-base"} onClick={() => setMobileOpen(false)}>
                  {t("billing")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className={navClass("/admin") + " block text-base"} onClick={() => setMobileOpen(false)}>
                  {t("adminDashboard")}
                </Link>
              </li>
            </Show>
            <Show when="signed-out">
              <li className="pt-2 border-t border-white/10">
                <SignInButton mode="redirect">
                  <button className="font-body text-base text-cream-300 hover:text-brand-gold" onClick={() => setMobileOpen(false)}>
                    {t("signIn")}
                  </button>
                </SignInButton>
              </li>
            </Show>
            <li className="pt-2 border-t border-white/10">
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
