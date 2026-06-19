"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Overview",    href: "/admin" },
  { label: "Users",       href: "/admin/users" },
  { label: "Bookings",    href: "/admin/bookings" },
  { label: "Consultants", href: "/admin/consultants" },
  { label: "Contacts",    href: "/admin/contacts" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex flex-wrap gap-1 rounded-xl border border-cream-300 bg-white p-1.5 shadow-sm">
      {links.map(({ label, href }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={[
              "rounded-lg px-4 py-2 font-body text-sm font-medium transition-colors",
              active
                ? "bg-brand-indigo text-cream-200"
                : "text-indigo-600 hover:bg-cream-200",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
