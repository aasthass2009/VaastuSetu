import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { syncUser } from "@/lib/sync-user";
import { AdminNav } from "./_components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream-200">
      <div className="bg-brand-indigo px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-heading text-lg font-semibold text-cream-200">
              VaastuSetu <span className="text-brand-gold">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-body text-xs text-cream-300">{dbUser.email}</p>
            <Link href="/dashboard" className="font-body text-xs text-cream-300 underline-offset-2 hover:underline">
              ← App
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
