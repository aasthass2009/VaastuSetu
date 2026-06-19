import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const [
    totalUsers,
    totalHomes,
    totalReports,
    totalBookings,
    revenueResult,
    recentUsers,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.home.count(),
    prisma.report.count(),
    prisma.booking.count(),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { amountPaise: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        consultant: { include: { user: { select: { name: true } } } },
      },
    }),
  ]);

  const totalRevenuePaise = revenueResult._sum.amountPaise ?? 0;
  const totalRevenueINR = (totalRevenuePaise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const stats = [
    { label: "Total Users",    value: totalUsers,    href: "/admin/users",      colour: "text-brand-indigo" },
    { label: "Homes Scored",   value: totalHomes,    href: "/admin/users",      colour: "text-brand-saffron" },
    { label: "Reports",        value: totalReports,  href: "/admin/users",      colour: "text-brand-gold" },
    { label: "Bookings",       value: totalBookings, href: "/admin/bookings",   colour: "text-indigo-500" },
    { label: "Revenue (paid)", value: totalRevenueINR, href: "/admin/users",   colour: "text-green-600" },
  ];

  const BOOKING_BADGE: Record<string, string> = {
    PENDING:   "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-indigo-100 text-indigo-700",
    CANCELLED: "bg-red-100 text-red-600",
    NO_SHOW:   "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-brand-indigo">Overview</h1>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, href, colour }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-cream-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="font-body text-xs font-medium uppercase tracking-wider text-indigo-400">
              {label}
            </p>
            <p className={`mt-1 font-heading text-3xl font-semibold ${colour}`}>
              {value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <div className="rounded-2xl border border-cream-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-brand-indigo">Recent Users</h2>
            <Link href="/admin/users" className="font-body text-xs text-brand-saffron hover:underline">
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-cream-300">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-semibold text-brand-indigo">
                    {u.name ?? u.email}
                  </p>
                  <p className="truncate font-body text-xs text-indigo-400">{u.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 font-body text-xs font-semibold ${
                  u.role === "ADMIN" ? "bg-brand-gold/15 text-brand-gold" :
                  u.role === "CONSULTANT" ? "bg-indigo-100 text-indigo-600" :
                  "bg-cream-300 text-indigo-500"
                }`}>
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent bookings */}
        <div className="rounded-2xl border border-cream-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-brand-indigo">Recent Bookings</h2>
            <Link href="/admin/bookings" className="font-body text-xs text-brand-saffron hover:underline">
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-cream-300">
            {recentBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-semibold text-brand-indigo">
                    {b.user.name ?? b.user.email}
                  </p>
                  <p className="truncate font-body text-xs text-indigo-400">
                    {b.consultant.user.name} · {new Date(b.scheduledAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 font-body text-xs font-semibold ${BOOKING_BADGE[b.status] ?? BOOKING_BADGE.PENDING}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
