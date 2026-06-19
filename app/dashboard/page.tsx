import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "Requested",  cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed",  cls: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Completed",  cls: "bg-indigo-100 text-indigo-700" },
  CANCELLED: { label: "Cancelled",  cls: "bg-red-100 text-red-600" },
  NO_SHOW:   { label: "No-show",    cls: "bg-gray-100 text-gray-500" },
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();

  const [homesCount, reportsCount, bookingsCount, upcomingBookings, subscription] = dbUser
    ? await Promise.all([
        prisma.home.count({ where: { userId: dbUser.id } }),
        prisma.report.count({
          where: { home: { userId: dbUser.id }, pdfUrl: { not: null } },
        }),
        prisma.booking.count({ where: { userId: dbUser.id } }),
        prisma.booking.findMany({
          where: {
            userId: dbUser.id,
            scheduledAt: { gte: new Date() },
            status: { notIn: ["CANCELLED", "NO_SHOW"] },
          },
          include: { consultant: { include: { user: { select: { name: true } } } } },
          orderBy: { scheduledAt: "asc" },
          take: 3,
        }),
        prisma.subscription.findUnique({ where: { userId: dbUser.id } }),
      ])
    : [0, 0, 0, [], null];

  const t = await getTranslations("dashboard");

  const isPro =
    subscription?.plan === "PRO" &&
    subscription?.status === "ACTIVE" &&
    subscription.currentPeriodEnd != null &&
    new Date(subscription.currentPeriodEnd) > new Date();

  const proExpiry = isPro && subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const displayName = dbUser?.name?.split(" ")[0] ?? "there";
  const memberSince = dbUser
    ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-cream-200 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Welcome */}
        <div className="mb-10">
          <p className="font-body text-sm font-medium uppercase tracking-widest text-brand-saffron">
            {t("sectionLabel")}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-brand-indigo sm:text-4xl md:text-5xl">
            {t("welcomePrefix")} {displayName} ✦
          </h1>
          {dbUser && (
            <p className="mt-2 truncate font-body text-base text-indigo-600">
              {dbUser.email}
            </p>
          )}
        </div>

        {/* Plan badge */}
        <div className="mb-6 flex items-center gap-3">
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-3 py-1 font-body text-xs font-semibold text-brand-gold">
              ✦ {t("proActiveUntil")} {proExpiry}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-300 px-3 py-1 font-body text-xs font-semibold text-indigo-500">
              {t("freePlan")}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">{t("myHomes")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-saffron">
                {homesCount}
              </p>
              <p className="mt-1 font-body text-sm text-indigo-600">
                {t("savedProperties")}
              </p>
              <Button
                asChild
                variant="link"
                className="mt-2 h-auto p-0 font-body text-xs text-brand-saffron"
              >
                {homesCount === 0 ? (
                  <Link href="/vaastu-score">{t("scoreFirst")}</Link>
                ) : (
                  <Link href="/homes">{t("viewAllHomes")}</Link>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">{t("reports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-gold">
                {reportsCount}
              </p>
              <p className="mt-1 font-body text-sm text-indigo-600">
                {t("reportsDesc")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">{t("bookings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-indigo">
                {bookingsCount}
              </p>
              <p className="mt-1 font-body text-sm text-indigo-600">
                {t("bookingsDesc")}
              </p>
              <Button
                asChild
                variant="link"
                className="mt-2 h-auto p-0 font-body text-xs text-brand-saffron"
              >
                <Link href="/consultants">{t("browseConsultants")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming bookings */}
        {upcomingBookings.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-heading text-xl font-semibold text-brand-indigo">
              {t("upcomingConsultations")}
            </h2>
            <div className="space-y-3">
              {upcomingBookings.map((b) => {
                const dt = new Date(b.scheduledAt);
                const formatted = dt.toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const badge = STATUS_LABEL[b.status] ?? STATUS_LABEL.PENDING;
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-1 rounded-xl border border-cream-300 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-body text-sm font-semibold text-brand-indigo">
                        {b.consultant.user.name}
                      </p>
                      <p className="font-body text-xs text-indigo-500">{formatted}</p>
                    </div>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Account meta + quick links */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {memberSince && (
            <p className="font-body text-xs text-indigo-400">
              {t("memberSince")} {memberSince}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="border-cream-400 text-indigo-600 hover:bg-brand-indigo hover:text-cream-200">
              <Link href="/billing">{t("billingLink")}</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-cream-400 text-indigo-600 hover:bg-brand-indigo hover:text-cream-200">
              <Link href="/profile">{t("profileLink")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
