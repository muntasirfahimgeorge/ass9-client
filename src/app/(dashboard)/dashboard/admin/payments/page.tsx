
import Link from "next/link";
import { ArrowLeft, CreditCard, DollarSign, Receipt, Wallet } from "lucide-react";

import {
  getAdminPayments,
  type TAdminPayment,
} from "@/lib/api/admin-overview";

export const dynamic = "force-dynamic";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function PaymentRow({ payment }: { payment: TAdminPayment }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-5 py-4">
        <p className="font-medium">{payment.serviceTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Booking: {payment.bookingId}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="font-medium">{payment.customerName}</p>
        <p className="text-xs text-muted-foreground">
          {payment.customerEmail}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="font-medium">{payment.technicianName}</p>
        <p className="text-xs text-muted-foreground">
          {payment.technicianEmail}
        </p>
      </td>

      <td className="px-5 py-4 font-semibold">
        {formatCurrency(payment.amount)}
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
          Paid
        </span>
      </td>

      <td className="px-5 py-4 text-sm text-muted-foreground">
        {formatDate(payment.paidAt)}
      </td>

      <td className="px-5 py-4">
        <p
          className="max-w-44 truncate font-mono text-xs text-muted-foreground"
          title={payment.transactionId}
        >
          {payment.transactionId}
        </p>
      </td>
    </tr>
  );
}

const AdminPaymentsPage = async () => {
  let summary;

  try {
    summary = await getAdminPayments();
  } catch (error) {
    return (
      <div className="space-y-3 p-6">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="font-medium text-destructive">
            Unable to load payment records.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const payments = [...summary.payments].sort(
    (a, b) =>
      new Date(b.paidAt).getTime() -
      new Date(a.paidAt).getTime()
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor all successful customer transactions.
          </p>
        </div>

        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Revenue
            </p>
            <DollarSign className="size-5 text-green-600" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total successfully collected revenue
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Transactions
            </p>
            <Receipt className="size-5 text-blue-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {summary.totalTransactions}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Successful payment transactions
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Payment Records
            </p>
            <Wallet className="size-5 text-purple-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {payments.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Transactions returned by the server
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="font-semibold">Transaction History</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All recorded successful payments
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-600">
            <CreditCard className="size-4" />
            Secure Payments
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CreditCard className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">
              No payment records yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Successful customer transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Service</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Technician</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Paid Date</th>
                  <th className="px-5 py-4 font-medium">Transaction ID</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <PaymentRow
                    key={payment._id}
                    payment={payment}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t px-5 py-4 text-xs text-muted-foreground">
          Showing {payments.length} payment record(s).
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
