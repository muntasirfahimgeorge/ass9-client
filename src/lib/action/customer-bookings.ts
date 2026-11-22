"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";

type TActionResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

type TCreateBookingInput = {
  serviceId: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
};

async function getCustomerToken() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "customer") {
    return {
      token: null,
      message: "Only customers can perform this action.",
    };
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    return {
      token: null,
      message: "Authentication token unavailable. Please sign in again.",
    };
  }

  return {
    token: tokenResponse.token,
    message: "",
  };
}

async function sendCustomerRequest(
  endpoint: string,
  method: string,
  token: string,
  payload?: Record<string, unknown>
) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
    cache: "no-store",
  });
}

export async function createRepairBooking(
  input: TCreateBookingInput
): Promise<TActionResult> {
  if (!/^[0-9a-fA-F]{24}$/.test(input.serviceId)) {
    return { success: false, message: "Invalid service ID." };
  }

  if (
    typeof input.customerPhone !== "string" ||
    input.customerPhone.trim().length < 7 ||
    input.customerPhone.trim().length > 20
  ) {
    return { success: false, message: "Enter a valid phone number." };
  }

  if (
    typeof input.address !== "string" ||
    input.address.trim().length < 5
  ) {
    return { success: false, message: "Enter a valid address." };
  }

  if (
    typeof input.preferredDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.preferredDate)
  ) {
    return { success: false, message: "Select a valid preferred date." };
  }

  const [year, month, day] = input.preferredDate.split("-").map(Number);
  const selectedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    selectedDate.getUTCFullYear() !== year ||
    selectedDate.getUTCMonth() !== month - 1 ||
    selectedDate.getUTCDate() !== day
  ) {
    return { success: false, message: "Select a valid preferred date." };
  }

  if (
    typeof input.problemDescription !== "string" ||
    input.problemDescription.trim().length < 20
  ) {
    return {
      success: false,
      message: "Problem description must contain at least 20 characters.",
    };
  }

  const { token, message } = await getCustomerToken();

  if (!token) {
    return { success: false, message };
  }

  try {
    const response = await sendCustomerRequest(
      "/bookings",
      "POST",
      token,
      {
        serviceId: input.serviceId,
        customerPhone: input.customerPhone.trim(),
        address: input.address.trim(),
        preferredDate: input.preferredDate,
        problemDescription: input.problemDescription.trim(),
      }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: body?.message || "Could not submit your repair request.",
      };
    }

    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/customer/bookings");
    revalidatePath("/dashboard/customer/bookings/upcoming");

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

export async function cancelMyBooking(
  bookingId: string
): Promise<TActionResult> {
  if (!/^[0-9a-fA-F]{24}$/.test(bookingId)) {
    return { success: false, message: "Invalid booking ID." };
  }

  const { token, message } = await getCustomerToken();

  if (!token) {
    return { success: false, message };
  }

  try {
    const response = await sendCustomerRequest(
      `/bookings/${encodeURIComponent(bookingId)}/cancel`,
      "PATCH",
      token
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: body?.message || "Could not cancel this booking.",
      };
    }

    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/customer/bookings");
    revalidatePath("/dashboard/customer/bookings/upcoming");

    return {
      success: true,
      message: body?.message || "Booking cancelled successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Could not connect to the server. Please try again.",
    };
  }
}

export async function createBookingCheckout(
  bookingId: string
): Promise<TActionResult> {
  if (!/^[0-9a-fA-F]{24}$/.test(bookingId)) {
    return { success: false, message: "Invalid booking ID." };
  }

  const { token, message } = await getCustomerToken();

  if (!token) {
    return { success: false, message };
  }

  try {
    const response = await sendCustomerRequest(
      "/payments/create-checkout-session",
      "POST",
      token,
      { bookingId }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: body?.message || "Could not start payment.",
      };
    }

    const checkoutUrl = body?.data?.checkoutUrl;

    if (
      typeof checkoutUrl !== "string" ||
      !checkoutUrl.startsWith("https://")
    ) {
      return {
        success: false,
        message: "Stripe Checkout URL is invalid.",
      };
    }

    return {
      success: true,
      message: body?.message || "Redirecting to secure checkout.",
      data: { checkoutUrl },
    };
  } catch {
    return {
      success: false,
      message: "Could not connect to the payment server. Please try again.",
    };
  }
}
