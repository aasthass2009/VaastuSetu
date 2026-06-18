import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = {
  title: "Profile & Settings | VaastuSetu",
  description: "View and update your VaastuSetu profile details.",
};

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: dbUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      country: true,
      preferredLanguage: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) redirect("/sign-in");

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const serialised = {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-cream-200">
      {/* Page header */}
      <div className="bg-brand-indigo px-6 py-12">
        <div className="mx-auto max-w-3xl flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 font-heading text-2xl font-semibold text-brand-gold ring-4 ring-brand-gold/30">
            {initials}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-cream-200 md:text-3xl">
              {user.name ?? "Your Profile"}
            </h1>
            <p className="mt-0.5 font-body text-sm text-cream-300">
              {user.email} · Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-1 font-heading text-xl font-semibold text-brand-indigo">
            Profile & Settings
          </h2>
          <p className="mb-6 font-body text-sm text-indigo-500">
            Update your display name, location, and language preferences.
          </p>
          <ProfileForm user={serialised} />
        </div>

        {/* Read-only account info */}
        <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-4 font-heading text-base font-semibold text-brand-indigo">
            Account Details
          </h2>
          <dl className="space-y-3">
            {[
              { label: "Account type", value: user.role === "ADMIN" ? "Administrator" : user.role === "CONSULTANT" ? "Consultant" : "Client" },
              { label: "User ID", value: user.id },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-6">
                <dt className="w-32 shrink-0 font-body text-xs font-medium uppercase tracking-wider text-indigo-400">
                  {label}
                </dt>
                <dd className="font-body text-sm text-indigo-700 font-mono break-all">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
