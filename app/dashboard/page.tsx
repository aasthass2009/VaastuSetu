import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  const primaryEmail = clerkUser?.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const dbUser = primaryEmail
    ? await prisma.user.findUnique({ where: { email: primaryEmail } })
    : null;

  const displayName =
    clerkUser?.firstName ?? dbUser?.name?.split(" ")[0] ?? "there";

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
          <p className="mt-2 font-body text-base text-indigo-600">
            {primaryEmail}
          </p>
        </div>

        {/* Status cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">My Homes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-saffron">0</p>
              <p className="mt-1 font-body text-sm text-indigo-600">Saved properties</p>
            </CardContent>
          </Card>

          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-gold">0</p>
              <p className="mt-1 font-body text-sm text-indigo-600">Vastu reports generated</p>
            </CardContent>
          </Card>

          <Card className="border-cream-300">
            <CardHeader>
              <CardTitle className="text-lg">Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-semibold text-brand-indigo">0</p>
              <p className="mt-1 font-body text-sm text-indigo-600">Consultations booked</p>
            </CardContent>
          </Card>
        </div>

        {dbUser ? (
          <p className="mt-8 font-body text-xs text-indigo-400">
            Account synced to database · joined{" "}
            {new Date(dbUser.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        ) : (
          <p className="mt-8 font-body text-xs text-indigo-400">
            Account not yet synced — add the Clerk webhook to sync automatically.
          </p>
        )}
      </div>
    </div>
  );
}
