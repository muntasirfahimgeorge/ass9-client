import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowRight,
  Wrench,
} from "lucide-react";

import { getMyBookings, getMyPayments } from "@/lib/api/customer-bookings";
import type { TBooking } from "@/types";
import type { TPayment } from "@/lib/api/customer-bookings";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);

const formatDate = (date: string | Date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusStyles: Record<string, string> = {
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  "in-progress": "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export default async function CustomerDashboardPage() {
  let bookings: TBooking[] = [];
  let payments: TPayment[] = [];
  let bookingError = false;
  let paymentError = false;

  const [bookingResult, paymentResult] = await Promise.allSettled([
    getMyBookings(),
    getMyPayments(),
  ]);

  if (bookingResult.status === "fulfilled") {
    bookings = bookingResult.value;
  } else {
    bookingError = true;
  }

  if (paymentResult.status === "fulfilled") {
    payments = paymentResult.value;
  } else {
    paymentError = true;
  }

  const activeBookings = bookings.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(booking.status)
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const unpaidBookings = completedBookings.filter(
    (booking) => booking.paymentStatus === "unpaid"
  );

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.paidAt).getTime() -
        new Date(a.paidAt).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarCheck,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Bookings",
      value: activeBookings.length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Completed Jobs",
      value: completedBookings.length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Paid",
      value: formatCurrency(totalPaid),
      icon: CreditCard,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="rounded-2xl bg-[#14243A] p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#B8F34A]">
              CUSTOMER DASHBOARD
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome to FixMate!
            </h1>

            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Manage your repair bookings, track service progress, and
              review your payments from one place.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#B8F34A] px-5 py-3 text-sm font-bold text-[#14243A] transition hover:bg-[#a5df36]"
          >
            <Wrench size={17} />
            Explore Services
          </Link>
        </div>
      </section>

      {(bookingError || paymentError) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {bookingError && (
            <p>Booking information could not be loaded.</p>
          )}
          {paymentError && (
            <p>Payment information could not be loaded.</p>
          )}
          <p className="mt-1">
            Please refresh the page or sign in again.
          </p>
        </div>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your repair activity at a glance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {unpaidBookings.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-amber-900">
                Payment Pending
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                You have {unpaidBookings.length} completed booking(s)
                waiting for payment.
              </p>
            </div>

            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-900 hover:underline"
            >
              View Bookings <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Bookings
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your latest repair requests.
            </p>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarCheck className="mx-auto text-slate-300" size={35} />
            <p className="mt-3 font-semibold text-slate-700">
              No bookings yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Explore our services to book your first repair.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex rounded-lg bg-[#14243A] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {booking.serviceTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Booked: {formatDate(booking.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      statusStyles[booking.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {booking.status}
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(
                      booking.status === "completed"
                        ? booking.finalAmount
                        : booking.basePrice
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Payments
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your latest successful transactions.
            </p>
          </div>

          <Link
            href="/dashboard/customer/payments"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {recentPayments.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No payment records found.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPayments.map((payment) => (
              <div
                key={payment._id}
                className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {payment.serviceTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(payment.paidAt)}
                  </p>
                </div>

                <p className="font-bold text-green-700">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
