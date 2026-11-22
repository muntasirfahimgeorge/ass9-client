
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ServicesTable from "@/components/dashboard/admin/ServicesTable";
import { getAdminServices } from "@/lib/api/admin-services";
import { auth } from "@/lib/auth";
import type { TApprovalStatus } from "@/types";

type AdminServicesPageProps = {
  searchParams: Promise<{
    approvalStatus?: string;
  }>;
};

const VALID_FILTERS = [
  "all",
  "pending",
  "approved",
  "rejected",
] as const;

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const role = session.user.role ?? "customer";

  if (role !== "admin") {
    redirect(`/dashboard/${role}`);
  }

  const params = await searchParams;

  const requestedFilter = params.approvalStatus ?? "all";

  const filter = VALID_FILTERS.includes(
    requestedFilter as (typeof VALID_FILTERS)[number]
  )
    ? requestedFilter
    : "all";

  const services = await getAdminServices(
    filter as TApprovalStatus | "all"
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#15295e]">
          Services Management
        </h1>

        <p className="text-sm text-muted-foreground">
          Review technician service submissions and manage their approval status.
        </p>
      </div>

      <ServicesTable
        services={services}
        initialFilter={filter as TApprovalStatus | "all"}
      />
    </div>
  );
}
