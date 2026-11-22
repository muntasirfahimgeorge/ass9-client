import Link from "next/link";
import { verifyMyPayment } from "@/lib/api/customer-bookings";

type PageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  let payment = null;
  let error = "";

  if (!params.session_id) {
    error = "Payment session ID was not provided.";
  } else {
    try {
      payment = await verifyMyPayment(params.session_id);
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "Payment verification failed.";
    }
  }

  if (!payment) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
            !
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Payment Verification Failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {error}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            If your payment was deducted, please check your payment history.
          </p>

          <Link
            href="/dashboard/customer/bookings"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to My Bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
          Payment Confirmed
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-3 text-gray-600">
          Your repair service payment has been verified successfully.
        </p>

        <div className="mt-8 space-y-4 rounded-xl bg-gray-50 p-5 text-left">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Service</span>
            <span className="text-right text-sm font-semibold text-gray-900">
              {payment.serviceTitle}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Amount Paid</span>
            <span className="text-sm font-bold text-green-700">
              ${Number(payment.amount).toFixed(2)} USD
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Transaction ID</span>
            <span className="max-w-[65%] break-all text-right text-xs font-medium text-gray-700">
              {payment.transactionId}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Paid At</span>
            <span className="text-right text-sm text-gray-700">
              {new Date(payment.paidAt).toLocaleString()}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-7 inline-flex w-full justify-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          View My Bookings
        </Link>
      </div>
    </main>
  );
}
