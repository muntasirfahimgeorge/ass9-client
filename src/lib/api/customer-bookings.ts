import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "./config";
import type { TBooking } from "@/types";

export type TPayment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: "usd";
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string | Date;
};

async function getCustomerToken() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "customer") {
    throw new Error("Customer authentication required.");
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    throw new Error("Authentication token unavailable. Please sign in again.");
  }

  return tokenResponse.token;
}

async function customerFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getCustomerToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || "Could not complete the request.");
  }

  return body?.data as T;
}

export async function getMyBookings(): Promise<TBooking[]> {
  return customerFetch<TBooking[]>("/bookings/my");
}

export async function getMyPayments(): Promise<TPayment[]> {
  return customerFetch<TPayment[]>("/payments/my");
}

export async function verifyMyPayment(sessionId: string) {
  if (!sessionId.startsWith("cs_")) {
    throw new Error("Invalid payment session.");
  }

  return customerFetch<{
    amount: number;
    currency: string;
    transactionId: string;
    paidAt: string;
    serviceTitle: string;
  }>(`/payments/verify?session_id=${encodeURIComponent(sessionId)}`);
}
