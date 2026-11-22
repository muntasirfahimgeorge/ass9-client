
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TApprovalStatus } from "@/types";

type UpdateServiceApprovalInput = {
  serviceId: string;
  approvalStatus: Extract<TApprovalStatus, "approved" | "rejected">;
};

type UpdateServiceApprovalResult = {
  success: boolean;
  message: string;
};

export async function updateServiceApproval(
  input: UpdateServiceApprovalInput
): Promise<UpdateServiceApprovalResult> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      message: "Only administrators can review services.",
    };
  }

  if (
    !input.serviceId ||
    !/^[0-9a-fA-F]{24}$/.test(input.serviceId) ||
    !["approved", "rejected"].includes(input.approvalStatus)
  ) {
    return {
      success: false,
      message: "Invalid service information.",
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

  try {
    const res = await fetch(
      `${API_BASE_URL}/admin/services/${encodeURIComponent(input.serviceId)}/approval`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwtToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvalStatus: input.approvalStatus,
        }),
        cache: "no-store",
      }
    );

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: body?.message || "The server could not update this service.",
      };
    }

    revalidatePath("/dashboard/admin/services");
    revalidatePath("/services");

    return {
      success: true,
      message:
        body?.message || `Service ${input.approvalStatus} successfully.`,
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}
