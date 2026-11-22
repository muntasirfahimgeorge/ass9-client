import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    bookingId?: string;
  }>;
};

export default async function PaymentCancelPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-4xl text-yellow-600">
          !
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
          Checkout Cancelled
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Payment Was Not Completed
        </h1>

        <p className="mt-3 leading-6 text-gray-600">
          You cancelled the Stripe Checkout process. No payment was recorded.
          Your completed booking is still available for payment.
        </p>

        {params.bookingId && (
          <p className="mt-4 break-all text-xs text-gray-500">
            Booking ID: {params.bookingId}
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard/customer/bookings"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Return to My Bookings
          </Link>

          <Link
            href="/dashboard/customer"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
