import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      subscription: { select: { plan: true, status: true, currentPeriodEnd: true } },
      _count: { select: { homes: true, bookings: true } },
    },
  });

  const ROLE_STYLE: Record<string, string> = {
    ADMIN:      "bg-brand-gold/15 text-brand-gold",
    CONSULTANT: "bg-indigo-100 text-indigo-600",
    CLIENT:     "bg-cream-300 text-indigo-500",
  };

  function planLabel(sub: typeof users[0]["subscription"]) {
    if (!sub || sub.plan === "FREE") return { text: "Free", cls: "bg-cream-300 text-indigo-400" };
    const active =
      (sub.status === "ACTIVE" || sub.status === "CANCELLED") &&
      sub.currentPeriodEnd != null &&
      new Date(sub.currentPeriodEnd) > new Date();
    if (!active) return { text: "Expired", cls: "bg-slate-100 text-slate-500" };
    return { text: `Pro${sub.status === "CANCELLED" ? " (cancelled)" : ""}`, cls: "bg-green-100 text-green-700" };
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-brand-indigo">
        Users ({users.length})
      </h1>

      <div className="rounded-2xl border border-cream-300 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-cream-300">
                {["Name / Email", "Role", "Plan", "Homes", "Bookings", "Joined"].map((h) => (
                  <th key={h} className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-300">
              {users.map((u) => {
                const plan = planLabel(u.subscription);
                return (
                  <tr key={u.id} className="hover:bg-cream-100">
                    <td className="px-4 py-3">
                      <p className="font-body text-sm font-semibold text-brand-indigo">{u.name ?? "—"}</p>
                      <p className="font-body text-xs text-indigo-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 font-body text-xs font-semibold ${ROLE_STYLE[u.role] ?? ROLE_STYLE.CLIENT}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 font-body text-xs font-semibold ${plan.cls}`}>
                        {plan.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-indigo-600">{u._count.homes}</td>
                    <td className="px-4 py-3 font-body text-sm text-indigo-600">{u._count.bookings}</td>
                    <td className="px-4 py-3 font-body text-xs text-indigo-400">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
