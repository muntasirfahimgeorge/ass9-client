
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "./config";
import type { TApprovalStatus, TService } from "@/types";

export type TAdminServiceFilter = TApprovalStatus | "all";

export async function getAdminServices(
  approvalStatus: TAdminServiceFilter = "all"
): Promise<TService[]> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Only administrators can view all services.");
  }

  const jwtToken = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!jwtToken?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  const params = new URLSearchParams({
    approvalStatus,
  });

  const res = await fetch(
    `${API_BASE_URL}/admin/services?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken.token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message || `Could not load services (status ${res.status}).`
    );
  }

  return Array.isArray(body?.data) ? body.data : [];
}
