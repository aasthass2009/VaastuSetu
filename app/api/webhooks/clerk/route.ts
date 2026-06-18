import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma/client";

type ClerkEmailAddress = { email_address: string; id: string };

type ClerkUserPayload = {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
};

type WebhookEvent =
  | { type: "user.created"; data: ClerkUserPayload }
  | { type: "user.updated"; data: ClerkUserPayload }
  | { type: "user.deleted"; data: { id: string } };

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  // If no secret is configured, skip verification in dev and just process the event.
  // In production you MUST set CLERK_WEBHOOK_SECRET.
  const body = await req.text();

  if (secret) {
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
    }

    try {
      const wh = new Webhook(secret);
      wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(body) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } = event.data;

      const primaryEmail = email_addresses.find(
        (e) => e.id === primary_email_address_id
      )?.email_address;

      if (!primaryEmail) {
        return NextResponse.json({ error: "No primary email" }, { status: 400 });
      }

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: primaryEmail,
          name,
          avatarUrl: image_url,
          role: UserRole.CLIENT,
        },
        update: {
          email: primaryEmail,
          name,
          avatarUrl: image_url,
        },
      });

      return NextResponse.json({ status: "synced" });
    }

    case "user.deleted": {
      // Soft-ignore: we keep the row but could mark deleted if needed.
      return NextResponse.json({ status: "ignored" });
    }

    default:
      return NextResponse.json({ status: "unhandled" });
  }
}
