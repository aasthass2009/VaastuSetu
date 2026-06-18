import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Upsert the Clerk user into our DB on every dashboard visit.
  // See lib/sync-user.ts for the production webhook note.
  const dbUser = await syncUser();

  const [homesCount, reportsCount] = dbUser
    ? await Promise.all([
        prisma.home.count({ where: { userId: dbUser.id } }),
        prisma.report.count({
          where: { home: { userId: dbUser.id }, pdfUrl: { not: null } },
        }),
      ])
    : [0, 0];

  const displayName = dbUser?.name?.split(" ")[0] ?? "there";
  const memberSince = dbUser
    ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-cream-200 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Welcome banner */}
        <div className="mb-10">
          <p className="font-body text-sm font-medium uppercase tracking-widest text-brand-saffron">
            Your Dashboard
          </p>
          <h1 className="mt-1 font-heading text-4xl font-semibold text-brand-indigo md:text-5xl">
            Welcome, {displayName} ✦
          </h1>
          {dbUser && (
            <p className="mt-2 font-body text-base text-indigo-600">
              {dbUser.email}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">My Homes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-saffron">
                {homesCount}
              </p>
              <p className="mt-1 font-body text-sm text-indigo-600">
                Saved properties
              </p>
              {homesCount === 0 ? (
                <Button asChild variant="link" className="mt-2 h-auto p-0 font-body text-xs text-brand-saffron">
                  <Link href="/vaastu-score">Score your first home →</Link>
                </Button>
              ) : (
                <Button asChild variant="link" className="mt-2 h-auto p-0 font-body text-xs text-brand-saffron">
                  <Link href="/homes">View all homes →</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-gold">
                {reportsCount}
              </p>
              <p className="mt-1 font-body text-sm text-indigo-600">
                Vastu reports generated
              </p>
            </CardContent>
          </Card>

          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-indigo">
                0
              </p>
              <p className="mt-1 font-body text-sm text-indigo-600">
                Consultations booked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account meta */}
        {memberSince && (
          <p className="mt-8 font-body text-xs text-indigo-400">
            Member since {memberSince}
          </p>
        )}
      </div>
    </div>
  );
}
