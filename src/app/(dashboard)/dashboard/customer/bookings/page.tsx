import CustomerBookingsTable from "@/components/dashboard/customer/CustomerBookingsTable";
import { getMyBookings } from "@/lib/api/customer-bookings";

export default async function CustomerBookingsPage() {
  let bookings: import("@/types").TBooking[] = [];
  let error = "";

  try {
    bookings = await getMyBookings();
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Could not load your bookings.";
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#14243A]">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your repair requests, service progress and payments.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <CustomerBookingsTable bookings={bookings} />
      )}
    </div>
  );
}
