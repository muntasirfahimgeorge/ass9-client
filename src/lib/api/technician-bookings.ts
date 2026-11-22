import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TBooking } from "@/types";

export async function getTechnicianBookings(): Promise<TBooking[]> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || session.user.role !== "technician") {
    return [];
  }

  const tokenResponse = await auth.api.getToken({ headers: requestHeaders });

  if (!tokenResponse?.token) {
    throw new Error("Authentication token is unavailable. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}/bookings/technician`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
    },
    cache: "no-store",
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || "Could not load your bookings.");
  }

  return body?.data ?? [];
}
