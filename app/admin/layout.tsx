import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/sync-user";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncUser();
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream-200">
      <div className="bg-brand-indigo px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="font-heading text-lg font-semibold text-cream-200">
            VaastuSetu <span className="text-brand-gold">Admin</span>
          </p>
          <p className="font-body text-xs text-cream-300">{dbUser.email}</p>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
