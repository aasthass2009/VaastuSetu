"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "Room Guides",  href: "/room-guides" },
  { label: "Consultants",  href: "/consultants" },
  { label: "Services",     href: "/services" },
  { label: "About",        href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function navClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return [
      "font-body text-sm transition-colors",
      active ? "text-brand-gold" : "text-cream-300 hover:text-brand-gold",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-brand-indigo/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1" onClick={() => setMobileOpen(false)}>
          <span className="font-heading text-2xl font-semibold tracking-wide text-cream-200">Vaastu</span>
          <span className="font-heading text-2xl font-semibold tracking-wide text-brand-saffron">Setu</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={navClass(href)}>
              {label}
            </Link>
          ))}
          <Show when="signed-in">
            <Link href="/dashboard" className={navClass("/dashboard")}>
              Dashboard
            </Link>
          </Show>
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="font-body text-sm text-cream-300 transition-colors hover:text-brand-gold">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="rounded-md bg-brand-saffron px-4 py-1.5 font-body text-sm font-medium text-cream-200 transition-colors hover:bg-saffron-600">
                Get started
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
            />
          </Show>
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Show when="signed-out">
            <SignUpButton mode="redirect">
              <button className="rounded-md bg-brand-saffron px-3 py-1 font-body text-xs font-medium text-cream-200">
                Get started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { avatarBox: "h-7 w-7 ring-2 ring-brand-saffron ring-offset-1 ring-offset-brand-indigo" } }} />
          </Show>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="text-cream-300 hover:text-cream-200"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-brand-indigo px-6 py-4 md:hidden">
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
                  Dashboard
                </Link>
              </li>
            </Show>
            <Show when="signed-out">
              <li className="pt-2 border-t border-white/10">
                <SignInButton mode="redirect">
                  <button className="font-body text-base text-cream-300 hover:text-brand-gold" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </button>
                </SignInButton>
              </li>
            </Show>
          </ul>
        </nav>
      )}
    </header>
  );
}
