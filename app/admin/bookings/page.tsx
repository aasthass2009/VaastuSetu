import { prisma } from "@/lib/db";
import { BookingsClient } from "./_components/bookings-client";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      consultant: { include: { user: { select: { name: true } } } },
    },
  });

  const serialised = bookings.map((b) => ({
    id: b.id,
    scheduledAt: b.scheduledAt.toISOString(),
    durationMins: b.durationMins,
    status: b.status,
    user: b.user,
    consultant: { user: { name: b.consultant.user.name } },
  }));

  const counts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  const BADGE: Record<string, string> = {
    PENDING:   "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-indigo-100 text-indigo-700",
    CANCELLED: "bg-red-100 text-red-600",
    NO_SHOW:   "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold text-brand-indigo">
          Bookings ({bookings.length})
        </h1>
        <div className="flex flex-wrap gap-2">
          {Object.entries(counts).map(([status, count]) => (
            <span key={status} className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${BADGE[status] ?? BADGE.PENDING}`}>
              {count} {status.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="font-body text-sm text-indigo-400">No bookings yet.</p>
      ) : (
        <BookingsClient initial={serialised} />
      )}
    </div>
  );
}
