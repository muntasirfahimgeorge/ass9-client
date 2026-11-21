
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TServiceField, TServiceFormState } from "@/types";

const ALLOWED_ROLES = ["technician"];

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

type ServicePayload = {
  title: string;
  category: (typeof CATEGORIES)[number];
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: (typeof SERVICE_MODES)[number];
  serviceArea: string;
};

export async function createService(
  formData: FormData
): Promise<TServiceFormState> {
  try {
    return await saveService(formData);
  } catch (error) {
    console.error("createService failed:", error);

    return {
      success: false,
      message: "Something went wrong while submitting the service.",
    };
  }
}

async function saveService(
  formData: FormData
): Promise<TServiceFormState> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || !ALLOWED_ROLES.includes(session.user.role ?? "")) {
    return {
      success: false,
      message: "Only technicians can submit services.",
    };
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  const token = tokenResponse?.token;

  if (!token) {
    return {
      success: false,
      message: "Authentication token is unavailable. Please sign in again.",
    };
  }

  const { values, errors, data } = readServiceForm(formData);

  if (!data) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
      values,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message:
          body?.message ||
          "The server could not submit the service. Please try again.",
        values,
      };
    }

    revalidatePath("/dashboard/technician/services");

    return {
      success: true,
      message: `${data.title} was submitted for approval.`,
    };
  } catch (error) {
    console.error("Service API request failed:", error);

    return {
      success: false,
      message: "Could not reach the server. Please try again.",
      values,
    };
  }
}

function readServiceForm(formData: FormData): {
  values: Partial<Record<TServiceField, string>>;
  errors: Partial<Record<TServiceField, string>>;
  data: ServicePayload | null;
} {
  const values: Partial<Record<TServiceField, string>> = {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    basePrice: String(formData.get("basePrice") ?? "").trim(),
    estimatedDuration: String(
      formData.get("estimatedDuration") ?? ""
    ).trim(),
    serviceMode: String(formData.get("serviceMode") ?? "").trim(),
    serviceArea: String(formData.get("serviceArea") ?? "").trim(),
  };

  const errors: Partial<Record<TServiceField, string>> = {};

  if (!values.title) {
    errors.title = "Service title is required.";
  }

  if (
    !CATEGORIES.includes(
      values.category as (typeof CATEGORIES)[number]
    )
  ) {
    errors.category = "Choose a valid service category.";
  }

  if (!values.description) {
    errors.description = "Description is required.";
  }

  if (!isHttpUrl(values.image ?? "")) {
    errors.image = "Enter a valid HTTP or HTTPS image URL.";
  }

  const basePrice = Number(values.basePrice);

  if (
    values.basePrice === "" ||
    !Number.isFinite(basePrice) ||
    basePrice <= 0
  ) {
    errors.basePrice = "Base price must be greater than zero.";
  }

  if (!values.estimatedDuration) {
    errors.estimatedDuration = "Estimated duration is required.";
  }

  if (
    !SERVICE_MODES.includes(
      values.serviceMode as (typeof SERVICE_MODES)[number]
    )
  ) {
    errors.serviceMode = "Choose a valid service mode.";
  }

  if (!values.serviceArea) {
    errors.serviceArea = "Service area is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { values, errors, data: null };
  }

  return {
    values,
    errors,
    data: {
      title: values.title as string,
      category: values.category as ServicePayload["category"],
      description: values.description as string,
      image: values.image as string,
      basePrice,
      estimatedDuration: values.estimatedDuration as string,
      serviceMode: values.serviceMode as ServicePayload["serviceMode"],
      serviceArea: values.serviceArea as string,
    },
  };
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
