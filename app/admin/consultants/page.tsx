import { prisma } from "@/lib/db";
import { AdminConsultantClient } from "./_components/admin-client";

export default async function AdminConsultantsPage() {
  const consultants = await prisma.consultant.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <AdminConsultantClient initial={consultants} />;
}
