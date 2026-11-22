import { Wrench, CheckCircle2, Clock3, XCircle } from "lucide-react";
import AddServiceDialog from "@/components/dashboard/branchManager/AddServiceDialog";
import ServicesTable from "@/components/dashboard/branchManager/ServicesTable";
import { getMyServices } from "@/lib/api/technician-services";

export default async function TechnicianServicesPage() {
  const services = await getMyServices();

  const approved = services.filter((service) => service.approvalStatus === "approved").length;
  const pending = services.filter((service) => service.approvalStatus === "pending").length;
  const rejected = services.filter((service) => service.approvalStatus === "rejected").length;

  const stats = [
    { label: "Total services", value: services.length, icon: Wrench },
    { label: "Approved", value: approved, icon: CheckCircle2 },
    { label: "Pending review", value: pending, icon: Clock3 },
    { label: "Rejected", value: rejected, icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your repair services.
          </p>
        </div>
        <AddServiceDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Your service listings</h2>
          <p className="text-sm text-muted-foreground">
            Track approval status, availability, and update your listings.
          </p>
        </div>
        <ServicesTable services={services} />
      </section>
    </div>
  );
}
