import CustomerBookingsTable from "@/components/dashboard/customer/CustomerBookingsTable";
import { getMyBookings } from "@/lib/api/customer-bookings";

export default async function CustomerUpcomingBookingsPage() {
  let bookings: import("@/types").TBooking[] = [];
  let error = "";

  try {
    const allBookings = await getMyBookings();

    bookings = allBookings.filter((booking) =>
      ["requested", "accepted", "in-progress"].includes(booking.status)
    );
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Could not load upcoming bookings.";
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#14243A]">
          Upcoming Bookings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Follow your pending requests and active repair services.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <CustomerBookingsTable
          bookings={bookings}
          emptyMessage="You have no pending or active repair bookings."
        />
      )}
    </div>
  );
}
