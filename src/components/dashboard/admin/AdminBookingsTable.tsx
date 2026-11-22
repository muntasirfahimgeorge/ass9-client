
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Phone,
  UserRound,
  ClipboardList,
} from "lucide-react";
import type { TBooking, TBookingStatus } from "@/types";

type Props = {
  bookings: TBooking[];
  emptyMessage?: string;
};

const statusStyles: Record<TBookingStatus, string> = {
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  "in-progress": "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const filters = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

function formatDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

export default function AdminBookingsTable({
  bookings,
  emptyMessage = "No bookings found.",
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/dashboard/admin/bookings"
                : `/dashboard/admin/bookings?status=${filter.value}`
            }
            className="rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            No bookings found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="flex flex-col gap-5 p-5 lg:flex-row">
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 lg:w-44">
                  {booking.serviceImage ? (
                    <Image
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 176px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {booking.category}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        {booking.serviceTitle}
                      </h3>
                      <p className="mt-1 break-all text-xs text-gray-400">
                        Booking ID: {booking._id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {booking.status.replace("-", " ")}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <UserRound size={16} className="shrink-0" />
                      Customer: {booking.customerName}
                    </p>

                    <p className="flex items-center gap-2 break-all">
                      <Phone size={16} className="shrink-0" />
                      {booking.customerPhone}
                    </p>

                    <p className="flex items-center gap-2">
                      <UserRound size={16} className="shrink-0" />
                      Technician: {booking.technicianName}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="shrink-0" />
                      {formatDate(booking.preferredDate)}
                    </p>

                    <p className="flex items-start gap-2 sm:col-span-2">
                      <MapPin size={16} className="mt-0.5 shrink-0" />
                      <span>{booking.address}</span>
                    </p>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Problem Description
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {booking.problemDescription}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        {booking.status === "completed"
                          ? "Final Amount"
                          : "Base Price"}
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {money(
                          booking.status === "completed"
                            ? booking.finalAmount
                            : booking.basePrice
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>

                      <span className="text-xs text-gray-400">
                        Booked: {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
