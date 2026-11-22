import { ClipboardList, Clock3, CheckCircle2, Wrench } from "lucide-react";
import TechnicianBookingsTable from "@/components/dashboard/technician/TechnicianBookingsTable";
import { getTechnicianBookings } from "@/lib/api/technician-bookings";

export default async function TechnicianBookingsPage() {
  const bookings = await getTechnicianBookings();

  const requested = bookings.filter((booking) => booking.status === "requested").length;
  const active = bookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  ).length;
  const completed = bookings.filter((booking) => booking.status === "completed").length;

  const stats = [
    { label: "Total bookings", value: bookings.length, icon: ClipboardList },
    { label: "New requests", value: requested, icon: Clock3 },
    { label: "Active jobs", value: active, icon: Wrench },
    { label: "Completed", value: completed, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review customer requests and manage your repair jobs.
        </p>
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
          <h2 className="text-lg font-semibold">All assigned bookings</h2>
          <p className="text-sm text-muted-foreground">
            Accept or reject requests, update job progress, and complete repairs.
          </p>
        </div>
        <TechnicianBookingsTable bookings={bookings} />
      </section>
    </div>
  );
}
