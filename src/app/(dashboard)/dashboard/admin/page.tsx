
import Link from "next/link";
import {
  Users,
  UserRound,
  Wrench,
  CalendarCheck,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import {
  getAdminOverviewData,
  type TAdminPayment,
} from "@/lib/api/admin-overview";

import type { TBooking, TService } from "@/types";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <h3 className="mt-4 text-2xl font-bold text-gray-900">
        {value}
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    requested: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    "in-progress": "bg-indigo-100 text-indigo-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replaceAll("-", " ")}
    </span>
  );
}

function AdminDashboardContent({
  users,
  services,
  bookings,
  paymentSummary,
}: {
  users: Awaited<ReturnType<typeof getAdminOverviewData>>["users"];
  services: TService[];
  bookings: TBooking[];
  paymentSummary: {
    payments: TAdminPayment[];
    totalRevenue: number;
    totalTransactions: number;
  };
}) {
  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const totalTechnicians = users.filter(
    (user) => user.role === "technician"
  ).length;

  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  );

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  );

  const activeBookings = bookings.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(booking.status)
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentPayments = paymentSummary.payments.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor FixMate users, services, bookings and payments.
          </p>
        </div>

        <Link
          href="/dashboard/admin/bookings"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Bookings
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Platform Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
            description={`${totalCustomers} customers and ${totalTechnicians} technicians`}
            icon={Users}
          />

          <StatCard
            title="Total Services"
            value={services.length}
            description={`${approvedServices.length} approved services`}
            icon={Wrench}
          />

          <StatCard
            title="Total Bookings"
            value={bookings.length}
            description={`${activeBookings.length} active bookings`}
            icon={CalendarCheck}
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(paymentSummary.totalRevenue)}
            description={`${paymentSummary.totalTransactions} successful transactions`}
            icon={DollarSign}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Booking & Service Statistics
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Customers"
            value={totalCustomers}
            description="Registered customer accounts"
            icon={UserRound}
          />

          <StatCard
            title="Technicians"
            value={totalTechnicians}
            description="Registered technician accounts"
            icon={Users}
          />

          <StatCard
            title="Pending Approvals"
            value={pendingServices.length}
            description="Services waiting for review"
            icon={Clock}
          />

          <StatCard
            title="Completed Jobs"
            value={completedBookings.length}
            description="Successfully completed bookings"
            icon={CheckCircle2}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Bookings
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Latest customer repair requests
              </p>
            </div>

            <Link
              href="/dashboard/admin/bookings"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No bookings available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col justify-between gap-3 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {booking.serviceTitle}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {booking.customerName} · {formatDate(booking.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatCurrency(booking.finalAmount || booking.basePrice)}
                    </p>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Pending Service Approvals
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Services requiring administrator review
              </p>
            </div>

            <Link
              href="/dashboard/admin/services?approvalStatus=pending"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {pendingServices.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No pending service approvals.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingServices.slice(0, 5).map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {service.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {service.technicianName} · {service.category}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatCurrency(service.basePrice)}
                    </p>
                  </div>

                  <StatusBadge status={service.approvalStatus} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Payments
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Latest successful Stripe transactions
            </p>
          </div>

          <Link
            href="/dashboard/admin/payments"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentPayments.length === 0 ? (
          <div className="py-8 text-center">
            <CreditCard className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              No successful payments yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-500">
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Transaction ID</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-800">
                      {payment.serviceTitle}
                    </td>
                    <td className="py-3 text-gray-600">
                      {payment.customerName}
                    </td>
                    <td className="max-w-[150px] truncate py-3 text-xs text-gray-500">
                      {payment.transactionId}
                    </td>
                    <td className="py-3 font-semibold text-gray-800">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={payment.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/admin/users"
          className="flex items-center justify-between rounded-xl border bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500">
                View users and manage account roles
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        <Link
          href="/dashboard/admin/services"
          className="flex items-center justify-between rounded-xl border bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Manage Services</p>
              <p className="text-xs text-gray-500">
                Review and approve technician services
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>
      </section>
    </div>
  );
}

export default async function AdminDashboard() {
  let data: Awaited<ReturnType<typeof getAdminOverviewData>> | null = null;
  let errorMessage: string | null = null;

  try {
    data = await getAdminOverviewData();
  } catch (error) {
    console.error("Admin dashboard error:", error);

    errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading dashboard data.";
  }

  if (errorMessage || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load Admin Dashboard
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {errorMessage ||
            "Something went wrong while loading dashboard data."}
        </p>
        <p className="mt-2 text-xs text-red-500">
          Check your backend server and administrator access.
        </p>
      </div>
    );
  }

  return (
    <AdminDashboardContent
      users={data.users}
      services={data.services}
      bookings={data.bookings}
      paymentSummary={data.paymentSummary}
    />
  );
}
