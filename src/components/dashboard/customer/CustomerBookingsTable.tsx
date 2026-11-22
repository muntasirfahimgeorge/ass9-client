
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Phone,
  CreditCard,
  XCircle,
  RefreshCw,
} from "lucide-react";
import type { TBooking, TBookingStatus } from "@/types";
import {
  cancelMyBooking,
  createBookingCheckout,
} from "@/lib/action/customer-bookings";

type Props = {
  bookings: TBooking[];
  emptyMessage?: string;
};

const statusStyles: Record<TBookingStatus, string> = {
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  "in-progress": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

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
  }).format(value);
}

export default function CustomerBookingsTable({
  bookings,
  emptyMessage = "You haven't made any repair requests yet.",
}: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");

  async function handleCancel(booking: TBooking) {
    if (booking.status !== "requested") return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel "${booking.serviceTitle}"?`
    );

    if (!confirmed) return;

    setLoadingId(booking._id);
    setError("");

    try {
      const result = await cancelMyBooking(booking._id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoadingId("");
    }
  }

  async function handlePayment(booking: TBooking) {
    if (
      booking.status !== "completed" ||
      booking.paymentStatus !== "unpaid"
    ) {
      return;
    }

    setLoadingId(booking._id);
    setError("");

    try {
      const result = await createBookingCheckout(booking._id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      const data = result.data as { checkoutUrl?: string } | undefined;

      if (!data?.checkoutUrl) {
        setError("Checkout URL was not returned.");
        return;
      }

      window.location.assign(data.checkoutUrl);
    } catch {
      setError("Could not start payment. Please try again.");
    } finally {
      setLoadingId("");
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#B8F34A]/20 text-[#14243A]">
          <CalendarDays size={30} />
        </div>

        <h3 className="mt-5 text-lg font-bold text-[#14243A]">
          No bookings found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          {emptyMessage}
        </p>

        <Link
          href="/services"
          className="mt-6 inline-flex rounded-lg bg-[#14243A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#203957]"
        >
          Explore Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        {bookings.map((booking) => {
          const isLoading = loadingId === booking._id;

          return (
            <article
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-44">
                  {booking.serviceImage ? (
                    <Image
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 176px"
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

                      <h3 className="mt-1 text-lg font-bold text-[#14243A]">
                        {booking.serviceTitle}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Technician: {booking.technicianName}
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
                      <CalendarDays size={16} className="shrink-0" />
                      {formatDate(booking.preferredDate)}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={16} className="shrink-0" />
                      {booking.customerPhone}
                    </p>

                    <p className="flex items-start gap-2 sm:col-span-2">
                      <MapPin size={16} className="mt-0.5 shrink-0" />
                      <span>{booking.address}</span>
                    </p>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Problem description
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {booking.problemDescription}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-gray-400">
                        {booking.status === "completed"
                          ? "Final amount"
                          : "Estimated base price"}
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#14243A]">
                        {money(
                          booking.status === "completed"
                            ? booking.finalAmount
                            : booking.basePrice
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Payment:{" "}
                        <span
                          className={
                            booking.paymentStatus === "paid"
                              ? "font-semibold text-green-600"
                              : "font-semibold text-amber-600"
                          }
                        >
                          {booking.paymentStatus}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.status === "requested" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking)}
                          disabled={isLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          {isLoading ? "Please wait..." : "Cancel Request"}
                        </button>
                      )}

                      {booking.status === "completed" &&
                        booking.paymentStatus === "unpaid" && (
                          <button
                            type="button"
                            onClick={() => handlePayment(booking)}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14243A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#203957] disabled:opacity-50"
                          >
                            <CreditCard size={16} />
                            {isLoading ? "Redirecting..." : "Pay Now"}
                          </button>
                        )}

                      {booking.paymentStatus === "paid" && (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
                          <CreditCard size={16} />
                          Payment Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => router.refresh()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#14243A] hover:text-[#567C12]"
      >
        <RefreshCw size={15} />
        Refresh bookings
      </button>
    </div>
  );
}
