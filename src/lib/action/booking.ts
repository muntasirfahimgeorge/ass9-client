
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";

export type TCreateBookingInput = {
  serviceId: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
};

export type TCreateBookingResult = {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    serviceTitle: string;
    status: string;
    paymentStatus: string;
  };
};

export async function createBooking(
  payload: TCreateBookingInput
): Promise<TCreateBookingResult> {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session) {
      return {
        success: false,
        message: "Please sign in before requesting a repair.",
      };
    }

    if (session.user.role !== "customer") {
      return {
        success: false,
        message: "Only customers can request repair services.",
      };
    }

    const jwtToken = await auth.api.getToken({
      headers: requestHeaders,
    });

    if (!jwtToken?.token) {
      return {
        success: false,
        message: "Authentication token not found. Please sign in again.",
      };
    }

    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: body?.message || "Failed to submit repair request.",
      };
    }

    revalidatePath("/dashboard/customer/bookings");

    return {
      success: true,
      message: body?.message || "Repair request submitted successfully.",
      data: body?.data,
    };
  } catch {
    return {
      success: false,
      message: "Could not connect to the server. Please try again.",
    };
  }
}
