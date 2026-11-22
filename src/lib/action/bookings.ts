"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TBookingStatus } from "@/types";

type BookingActionResult = {
  success: boolean;
  message: string;
};

const ALLOWED_STATUSES: TBookingStatus[] = [
  "accepted",
  "rejected",
  "in-progress",
  "completed",
];

async function getTechnicianToken() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || session.user.role !== "technician") {
    return {
      token: null,
      message: "Only technicians can update bookings.",
    };
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    return {
      token: null,
      message: "Authentication token is unavailable. Please sign in again.",
    };
  }

  return {
    token: tokenResponse.token,
    message: "",
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: TBookingStatus,
  finalAmount?: number
): Promise<BookingActionResult> {
  if (!/^[0-9a-fA-F]{24}$/.test(bookingId)) {
    return { success: false, message: "Invalid booking ID." };
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return { success: false, message: "Invalid booking status." };
  }

  if (
    status === "completed" &&
    (!Number.isFinite(finalAmount) || Number(finalAmount) <= 0)
  ) {
    return {
      success: false,
      message: "Final amount must be greater than zero.",
    };
  }

  const { token, message } = await getTechnicianToken();

  if (!token) {
    return { success: false, message };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/bookings/${encodeURIComponent(bookingId)}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...(status === "completed" ? { finalAmount } : {}),
        }),
        cache: "no-store",
      }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: body?.message || "Could not update booking status.",
      };
    }

    revalidatePath("/dashboard/technician");
    revalidatePath("/dashboard/technician/bookings");
    revalidatePath("/dashboard/technician/bookings/upcoming");

    return {
      success: true,
      message: body?.message || "Booking updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Could not connect to the server. Please try again.",
    };
  }
}
