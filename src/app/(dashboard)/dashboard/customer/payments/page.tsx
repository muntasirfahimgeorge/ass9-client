import Link from "next/link";
import { ArrowLeft, CreditCard, ReceiptText } from "lucide-react";

import { getMyPayments } from "@/lib/api/customer-bookings";
import type { TPayment } from "@/lib/api/customer-bookings";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);

const formatDate = (date: string | Date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default async function CustomerPaymentHistoryPage() {
  let payments: TPayment[] = [];
  let error = "";

  try {
    payments = await getMyPayments();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Could not load payment history.";
  }

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const sortedPayments = [...payments].sort(
    (a, b) =>
      new Date(b.paidAt).getTime() -
      new Date(a.paidAt).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payment History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your successful repair service payments.
          </p>
        </div>

        <Link
          href="/dashboard/customer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CreditCard size={23} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Total Successful Payments
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {payments.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ReceiptText size={23} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Total Amount Paid
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {formatCurrency(totalPaid)}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">
              Transaction Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Only verified successful payments are displayed here.
            </p>
          </div>

          {sortedPayments.length === 0 ? (
            <div className="p-10 text-center">
              <ReceiptText
                size={40}
                className="mx-auto text-slate-300"
              />
              <h3 className="mt-3 font-semibold text-slate-800">
                No payment history
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your successful payments will appear here.
              </p>
              <Link
                href="/services"
                className="mt-5 inline-flex rounded-lg bg-[#14243A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Explore Services
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Service</th>
                      <th className="px-5 py-4">Transaction ID</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {sortedPayments.map((payment) => (
                      <tr key={payment._id}>
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {payment.serviceTitle}
                        </td>
                        <td className="max-w-52 truncate px-5 py-4 font-mono text-xs text-slate-500">
                          {payment.transactionId}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {formatDate(payment.paidAt)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                            {payment.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {sortedPayments.map((payment) => (
                  <div key={payment._id} className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {payment.serviceTitle}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(payment.paidAt)}
                        </p>
                      </div>

                      <span className="whitespace-nowrap font-bold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>

                    <p className="break-all font-mono text-xs text-slate-500">
                      Transaction: {payment.transactionId}
                    </p>

                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                      {payment.paymentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
