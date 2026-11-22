"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Check, X, Play, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { updateBookingStatus } from "@/lib/action/bookings";
import type { TBooking, TBookingStatus } from "@/types";

type Props = {
  bookings: TBooking[];
};

const statusVariant = (status: TBookingStatus) => {
  if (status === "completed" || status === "accepted") return "default";
  if (status === "rejected" || status === "cancelled") return "destructive";
  return "secondary";
};

const formatDate = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TechnicianBookingsTable({ bookings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStatusUpdate = (
    booking: TBooking,
    status: TBookingStatus
  ) => {
    let finalAmount: number | undefined;

    if (status === "completed") {
      const enteredAmount = window.prompt(
        `Enter final repair amount in USD for "${booking.serviceTitle}":`,
        String(booking.finalAmount || booking.basePrice)
      );

      if (enteredAmount === null) return;

      finalAmount = Number(enteredAmount);

      if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
        toast.add({
          title: "Invalid amount",
          description: "Enter a valid amount greater than zero.",
          type: "error",
        });
        return;
      }
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to ${status === "in-progress" ? "start" : status} this booking?`
      );

      if (!confirmed) return;
    }

    setBusyId(booking._id);

    startTransition(async () => {
      const result = await updateBookingStatus(
        booking._id,
        status,
        finalAmount
      );

      setBusyId(null);

      toast.add({
        title: result.success ? "Booking updated" : "Update failed",
        description: result.message,
        type: result.success ? "success" : "error",
      });

      if (result.success) {
        window.location.reload();
      }
    });
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardCheck className="size-5 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">No bookings found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          New customer repair requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Appointment</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {bookings.map((booking) => (
              <tr key={booking._id} className="align-top">
                <td className="px-4 py-4">
                  <div className="flex min-w-[210px] items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {booking.serviceImage && (
                        <Image
                          src={booking.serviceImage}
                          alt={booking.serviceTitle}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{booking.serviceTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.category}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <p className="font-medium">{booking.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.customerEmail}
                  </p>
                  <p className="mt-1 text-xs">{booking.customerPhone}</p>
                  <p className="mt-1 max-w-[190px] whitespace-normal text-xs text-muted-foreground">
                    {booking.address}
                  </p>
                </td>

                <td className="px-4 py-4">
                  {formatDate(booking.preferredDate)}
                  <p className="mt-1 max-w-[180px] whitespace-normal text-xs text-muted-foreground">
                    {booking.problemDescription}
                  </p>
                </td>

                <td className="px-4 py-4 font-medium">
                  ${Number(booking.finalAmount ?? booking.basePrice).toFixed(2)}
                </td>

                <td className="px-4 py-4">
                  <Badge variant={statusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </td>

                <td className="px-4 py-4">
                  <Badge variant={booking.paymentStatus === "paid" ? "default" : "secondary"}>
                    {booking.paymentStatus}
                  </Badge>
                </td>

                <td className="px-4 py-4">
                  <div className="flex min-w-[150px] flex-col items-end gap-2">
                    {booking.status === "requested" && (
                      <>
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={isPending || busyId === booking._id}
                          onClick={() => handleStatusUpdate(booking, "accepted")}
                        >
                          <Check className="mr-1 size-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          disabled={isPending || busyId === booking._id}
                          onClick={() => handleStatusUpdate(booking, "rejected")}
                        >
                          <X className="mr-1 size-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={isPending || busyId === booking._id}
                        onClick={() => handleStatusUpdate(booking, "in-progress")}
                      >
                        <Play className="mr-1 size-4" />
                        Start Job
                      </Button>
                    )}

                    {booking.status === "in-progress" && (
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={isPending || busyId === booking._id}
                        onClick={() => handleStatusUpdate(booking, "completed")}
                      >
                        <Check className="mr-1 size-4" />
                        Complete Job
                      </Button>
                    )}

                    {["completed", "rejected", "cancelled"].includes(booking.status) && (
                      <span className="text-xs text-muted-foreground">
                        No actions available
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
