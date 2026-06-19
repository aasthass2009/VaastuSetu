import { prisma } from "@/lib/db";

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const STATUS_STYLE: Record<string, string> = {
    NEW:         "bg-brand-saffron/15 text-brand-saffron",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    RESOLVED:    "bg-green-100 text-green-700",
    CLOSED:      "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-brand-indigo">
        Contact Submissions ({contacts.length})
      </h1>

      {contacts.length === 0 ? (
        <p className="font-body text-sm text-indigo-400">No contact submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-2xl border border-cream-300 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-body text-sm font-semibold text-brand-indigo">{c.name}</p>
                    <span className={`rounded-full px-2 py-0.5 font-body text-xs font-semibold ${STATUS_STYLE[c.status] ?? STATUS_STYLE.NEW}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-body text-xs text-indigo-400">
                    {c.email}{c.phone ? ` · ${c.phone}` : ""}
                    {c.user?.name ? ` · account: ${c.user.name}` : ""}
                  </p>
                  {c.subject && (
                    <p className="mt-1 font-body text-sm font-medium text-indigo-600">{c.subject}</p>
                  )}
                </div>
                <p className="shrink-0 font-body text-xs text-indigo-300">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-3 border-t border-cream-300 pt-3 font-body text-sm text-indigo-700">
                {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
