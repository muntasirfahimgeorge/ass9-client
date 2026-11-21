
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TFixMateRole } from "@/lib/api/users";

type UpdateUserInput = {
  userId: string;
  role: TFixMateRole;
};

type UpdateUserResult = {
  success: boolean;
  message: string;
};

const ALLOWED_ROLES: TFixMateRole[] = [
  "customer",
  "technician",
  "admin",
];

export async function updateUser(
  input: UpdateUserInput
): Promise<UpdateUserResult> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      message: "Only administrators can change user roles.",
    };
  }

  if (!input.userId || !ALLOWED_ROLES.includes(input.role)) {
    return {
      success: false,
      message: "Invalid user information.",
    };
  }

  if (input.userId === session.user.id) {
    return {
      success: false,
      message: "You cannot change your own role.",
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
      `${API_BASE_URL}/admin/users/${encodeURIComponent(input.userId)}/role`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwtToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: input.role,
        }),
        cache: "no-store",
      }
    );

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: body?.message || "The server could not update this user.",
      };
    }

    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message: body?.message || "User role updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}
