
import Link from "next/link";
import { getAdminBookings } from "@/lib/api/admin-overview";
import AdminBookingsTable from "@/components/dashboard/admin/AdminBookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsUpcomingPage() {
  let upcomingBookings: Awaited<
    ReturnType<typeof getAdminBookings>
  > = [];

  let errorMessage: string | null = null;

  try {
    const allBookings = await getAdminBookings("all");

    upcomingBookings = allBookings
      .filter((booking) =>
        ["requested", "accepted", "in-progress"].includes(
          booking.status
        )
      )
      .sort(
        (a, b) =>
          new Date(a.preferredDate).getTime() -
          new Date(b.preferredDate).getTime()
      );
  } catch (error) {
    console.error("Admin upcoming bookings error:", error);

    errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong.";
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load upcoming bookings
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Upcoming Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review requested, accepted and ongoing repair jobs.
          </p>
        </div>

        <Link
          href="/dashboard/admin/bookings"
          className="inline-flex items-center justify-center rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          All Bookings
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">
          Active and upcoming bookings
        </p>
        <h2 className="mt-2 text-3xl font-bold text-blue-600">
          {upcomingBookings.length}
        </h2>
      </div>

      <AdminBookingsTable
        bookings={upcomingBookings}
        emptyMessage="There are no active or upcoming bookings."
      />
    </div>
  );
}
