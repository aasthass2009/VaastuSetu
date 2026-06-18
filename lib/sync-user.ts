// lib/sync-user.ts
//
// On-demand user sync: upserts the current Clerk user into our `users` table
// the first time they land on an authenticated page.
//
// Production note: replace (or supplement) this with Clerk webhooks
// (user.created / user.updated) so sign-ups are persisted immediately
// without waiting for the first page load. The /api/webhooks/clerk route
// is already wired — it just needs a public URL and CLERK_WEBHOOK_SECRET set.

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    undefined;

  // Upsert by email (guaranteed unique via Clerk). Also writes clerkId so
  // we can look up by either key in future. Name is kept in sync in case
  // the user updates their profile in Clerk.
  return await prisma.user.upsert({
    where: { email },
    create: { clerkId: clerkUser.id, email, name, role: "CLIENT" },
    update: { clerkId: clerkUser.id, name },
  });
}
