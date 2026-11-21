
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "./config";

export type TFixMateRole = "customer" | "technician" | "admin";

export type TFixMateAdminUser = {
  _id: string;
  name: string;
  email: string;
  role: TFixMateRole;
  image?: string | null;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string | Date;
  emailVerified?: boolean;
};

export async function getAllUsers(): Promise<TFixMateAdminUser[]> {
  const requestHeaders = await headers();
  const jwtToken = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!jwtToken?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message || `Could not load users (status ${res.status}).`
    );
  }

  return Array.isArray(body?.data) ? body.data : [];
}
