
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";

export type TProfileFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    phone?: string;
    area?: string;
    bio?: string;
    image?: string;
  };
};

type TProfileInput = {
  name: string;
  phone: string;
  area: string;
  bio: string;
  image: string;
};

export async function updateMyProfile(
  input: TProfileInput
): Promise<TProfileFormState> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return {
      success: false,
      message: "Please sign in to update your profile.",
    };
  }

  const values = {
    name: String(input.name ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    area: String(input.area ?? "").trim(),
    bio: String(input.bio ?? "").trim(),
    image: String(input.image ?? "").trim(),
  };

  const errors: NonNullable<TProfileFormState["errors"]> = {};

  if (values.name.length < 2 || values.name.length > 80) {
    errors.name = "Name must contain 2–80 characters.";
  }

  if (
    values.phone &&
    (
      values.phone.length < 7 ||
      values.phone.length > 20 ||
      !/^[+\d()\-\s]+$/.test(values.phone)
    )
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (values.area.length > 100) {
    errors.area = "Area cannot exceed 100 characters.";
  }

  if (values.bio.length > 500) {
    errors.bio = "Bio cannot exceed 500 characters.";
  }

  if (values.image) {
    try {
      const imageUrl = new URL(values.image);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        errors.image = "Enter a valid HTTP or HTTPS image URL.";
      }
    } catch {
      errors.image = "Enter a valid image URL.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
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
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        image: values.image || null,
      }),
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: body?.message || "Could not update your profile.",
      };
    }

    revalidatePath("/dashboard/customer/profile");
    revalidatePath("/dashboard/technician/profile");
    revalidatePath("/dashboard/admin/profile");

    revalidatePath("/dashboard");

    return {
      success: true,
      message: body?.message || "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Profile update failed:", error);

    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}
