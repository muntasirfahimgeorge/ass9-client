
import Link from "next/link";
import {
  Wrench,
  CalendarCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  BriefcaseBusiness,
  DollarSign,
  ClipboardList,
} from "lucide-react";

import { getTechnicianBookings } from "@/lib/api/technician-bookings";
import { getMyServices } from "@/lib/api/technician-services";
import type { TBooking, TService } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

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

const approvalStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function TechnicianDashboardPage() {
  let bookings: TBooking[] = [];
  let services: TService[] = [];

  let bookingError = false;
  let serviceError = false;

  const [bookingResult, serviceResult] = await Promise.allSettled([
    getTechnicianBookings(),
    getMyServices(),
  ]);

  if (bookingResult.status === "fulfilled") {
    bookings = bookingResult.value;
  } else {
    bookingError = true;
  }

  if (serviceResult.status === "fulfilled") {
    services = serviceResult.value;
  } else {
    serviceError = true;
  }

  const requestedBookings = bookings.filter(
    (booking) => booking.status === "requested"
  );

  const activeBookings = bookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const paidJobValue = completedBookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce(
      (total, booking) =>
        total + Number(booking.finalAmount || booking.basePrice || 0),
      0
    );

  const availableServices = services.filter(
    (service) =>
      service.approvalStatus === "approved" && service.isAvailable
  );

  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentServices = [...services]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      description: `${availableServices.length} approved and available`,
      icon: Wrench,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "New Requests",
      value: requestedBookings.length,
      description: "Waiting for your response",
      icon: ClipboardList,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Active Jobs",
      value: activeBookings.length,
      description: "Accepted or in progress",
      icon: Clock,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Completed Jobs",
      value: completedBookings.length,
      description: "Successfully completed",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="rounded-2xl bg-[#14243A] p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#B8F34A]">
              TECHNICIAN DASHBOARD
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome to FixMate!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Manage your repair services, respond to customer
              requests, track active jobs, and monitor your work.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/technician/services"
              className="inline-flex items-center gap-2 rounded-lg bg-[#B8F34A] px-5 py-3 text-sm font-bold text-[#14243A] transition hover:bg-[#a5df36]"
            >
              <Plus size={17} />
              Manage Services
            </Link>

            <Link
              href="/dashboard/technician/bookings"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <CalendarCheck size={17} />
              View Bookings
            </Link>
          </div>
        </div>
      </section>

      {(bookingError || serviceError) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {bookingError && (
            <p>Booking information could not be loaded.</p>
          )}
          {serviceError && (
            <p>Service information could not be loaded.</p>
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
            Your service and repair activity at a glance.
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
                <div className="flex items-center justify-between gap-3">
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

                <p className="mt-3 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <DollarSign size={23} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Paid Job Value
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {formatCurrency(paidJobValue)}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Total value of completed bookings marked as paid.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Services Awaiting Approval
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {pendingServices.length}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Services submitted for admin review.
          </p>
        </div>
      </section>

      {requestedBookings.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-amber-900">
                New Booking Requests
              </h3>

              <p className="mt-1 text-sm text-amber-800">
                You have {requestedBookings.length} customer request(s)
                waiting for your response.
              </p>
            </div>

            <Link
              href="/dashboard/technician/bookings"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-900 hover:underline"
            >
              Review Requests <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest repair requests assigned to you.
            </p>
          </div>

          <Link
            href="/dashboard/technician/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarCheck
              className="mx-auto text-slate-300"
              size={35}
            />

            <p className="mt-3 font-semibold text-slate-700">
              No bookings yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Customer bookings assigned to you will appear here.
            </p>
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
                    Customer: {booking.customerName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Preferred date: {formatDate(booking.preferredDate)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              My Recent Services
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recently added repair services.
            </p>
          </div>

          <Link
            href="/dashboard/technician/services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            Manage All <ArrowRight size={15} />
          </Link>
        </div>

        {recentServices.length === 0 ? (
          <div className="p-8 text-center">
            <Wrench className="mx-auto text-slate-300" size={35} />

            <p className="mt-3 font-semibold text-slate-700">
              No services added
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first repair service to get started.
            </p>

            <Link
              href="/dashboard/technician/services"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#14243A] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <Plus size={16} />
              Manage Services
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentServices.map((service) => (
              <div
                key={service._id}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                    <Wrench size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {service.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {service.category} · {formatDate(service.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      approvalStyles[service.approvalStatus] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {service.approvalStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.isAvailable
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {service.isAvailable ? "Available" : "Unavailable"}
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(service.basePrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
