
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TBooking, TService } from "@/types";
import type { TFixMateAdminUser } from "@/lib/api/users";

export type TAdminPayment = {
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

export type TAdminPaymentSummary = {
  payments: TAdminPayment[];
  totalRevenue: number;
  totalTransactions: number;
};

async function getAdminToken(): Promise<string> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Administrator access required.");
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    throw new Error("Authentication token unavailable. Please sign in again.");
  }

  return tokenResponse.token;
}

async function adminFetch<T>(endpoint: string): Promise<T> {
  const token = await getAdminToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || `Admin request failed (${response.status}).`
    );
  }

  return body?.data as T;
}

export async function getAdminBookings(
  status: string = "all"
): Promise<TBooking[]> {
  const params = new URLSearchParams({ status });

  return adminFetch<TBooking[]>(
    `/admin/bookings?${params.toString()}`
  );
}

export async function getAdminPayments(): Promise<TAdminPaymentSummary> {
  return adminFetch<TAdminPaymentSummary>("/admin/payments");
}

export async function getAdminOverviewData() {
  const [users, services, bookings, paymentSummary] =
    await Promise.all([
      adminFetch<TFixMateAdminUser[]>("/admin/users"),
      adminFetch<TService[]>("/admin/services"),
      adminFetch<TBooking[]>("/admin/bookings"),
      adminFetch<TAdminPaymentSummary>("/admin/payments"),
    ]);

  return {
    users,
    services,
    bookings,
    paymentSummary,
  };
}
