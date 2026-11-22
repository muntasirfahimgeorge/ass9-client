
import { getAdminBookings } from "@/lib/api/admin-overview";
import AdminBookingsTable from "@/components/dashboard/admin/AdminBookingsTable";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const VALID_STATUSES = [
  "all",
  "requested",
  "accepted",
  "rejected",
  "in-progress",
  "completed",
  "cancelled",
];

export default async function AdminBookingsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const requestedStatus = params.status ?? "all";

  const status = VALID_STATUSES.includes(requestedStatus)
    ? requestedStatus
    : "all";

  let bookings: Awaited<ReturnType<typeof getAdminBookings>> = [];
  let errorMessage: string | null = null;

  try {
    bookings = await getAdminBookings(status);
  } catch (error) {
    console.error("Admin bookings error:", error);

    errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong.";
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load bookings
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      </div>
    );
  }

  const activeBookings = bookings.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(
      booking.status
    )
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bookings Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and review all customer repair bookings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Displayed Bookings</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Active Bookings</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {activeBookings}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Completed Bookings</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {completedBookings}
          </h2>
        </div>
      </div>

      <AdminBookingsTable
        bookings={bookings}
        emptyMessage="There are no bookings matching this filter."
      />
    </div>
  );
}
