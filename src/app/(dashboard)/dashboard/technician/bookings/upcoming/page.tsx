import TechnicianBookingsTable from "@/components/dashboard/technician/TechnicianBookingsTable";
import { getTechnicianBookings } from "@/lib/api/technician-bookings";

export default async function TechnicianUpcomingBookingsPage() {
  const allBookings = await getTechnicianBookings();

  const upcomingBookings = allBookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upcoming Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage accepted repair jobs that are scheduled or in progress.
        </p>
      </div>

      <TechnicianBookingsTable bookings={upcomingBookings} />
    </div>
  );
}
