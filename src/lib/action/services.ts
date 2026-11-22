"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TServiceField, TServiceFormState } from "@/types";
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

type ActionResult = {
  success: boolean;
  message: string;
};

async function getTechnicianToken() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session || session.user.role !== "technician") {
    return { token: null, message: "Only technicians can manage services." };
  }

  const tokenResponse = await auth.api.getToken({ headers: requestHeaders });

  if (!tokenResponse?.token) {
    return { token: null, message: "Authentication token is unavailable. Please sign in again." };
  }

  return { token: tokenResponse.token, message: "" };
}

export async function uploadServiceImage(formData: FormData): Promise<{
  success: boolean;
  message: string;
  url?: string;
}> {
  try {
    const { token, message } = await getTechnicianToken();

    if (!token) return { success: false, message };

    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, message: "Please select an image." };
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return { success: false, message: "Only JPG, PNG, and WebP images are supported." };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "Image size must be 5 MB or less." };
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return { success: false, message: "ImgBB API key is not configured on the server." };
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success || !result?.data?.url) {
      return {
        success: false,
        message: result?.error?.message || "Image upload failed. Please try again.",
      };
    }

    return {
      success: true,
      message: "Image uploaded successfully.",
      url: result.data.url,
    };
  } catch {
    return { success: false, message: "Could not upload the image. Please try again." };
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
    estimatedDuration: String(formData.get("estimatedDuration") ?? "").trim(),
    serviceMode: String(formData.get("serviceMode") ?? "").trim(),
    serviceArea: String(formData.get("serviceArea") ?? "").trim(),
  };

  const errors: Partial<Record<TServiceField, string>> = {};

  if (!values.title || values.title.length > 100) errors.title = "Title is required (maximum 100 characters).";
  if (!CATEGORIES.includes(values.category as (typeof CATEGORIES)[number])) errors.category = "Choose a valid category.";
  if (!values.description || values.description.length < 10) errors.description = "Description must contain at least 10 characters.";
  if (!isHttpUrl(values.image ?? "")) errors.image = "Upload a valid service image.";
  const basePrice = Number(values.basePrice);
  if (!values.basePrice || !Number.isFinite(basePrice) || basePrice <= 0) errors.basePrice = "Enter a price greater than zero.";
  if (!values.estimatedDuration) errors.estimatedDuration = "Estimated duration is required.";
  if (!SERVICE_MODES.includes(values.serviceMode as (typeof SERVICE_MODES)[number])) errors.serviceMode = "Choose a valid service mode.";
  if (!values.serviceArea) errors.serviceArea = "Service area is required.";

  if (Object.keys(errors).length) return { values, errors, data: null };

  return {
    values,
    errors,
    data: {
      title: values.title!,
      category: values.category as ServicePayload["category"],
      description: values.description!,
      image: values.image!,
      basePrice,
      estimatedDuration: values.estimatedDuration!,
      serviceMode: values.serviceMode as ServicePayload["serviceMode"],
      serviceArea: values.serviceArea!,
    },
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function sendServiceRequest(
  endpoint: string,
  method: string,
  payload?: unknown
): Promise<ActionResult> {
  const { token, message } = await getTechnicianToken();

  if (!token) return { success: false, message };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(payload ? { "Content-Type": "application/json" } : {}),
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
      cache: "no-store",
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, message: body?.message || "The server could not complete this action." };
    }

    revalidatePath("/dashboard/technician");
    revalidatePath("/dashboard/technician/services");
    revalidatePath("/services");

    return { success: true, message: body?.message || "Service updated successfully." };
  } catch {
    return { success: false, message: "Could not connect to the server. Please try again." };
  }
}

export async function createService(formData: FormData): Promise<TServiceFormState> {
  const { values, errors, data } = readServiceForm(formData);

  if (!data) return { success: false, message: "Please correct the highlighted fields.", errors, values };

  const result = await sendServiceRequest("/services", "POST", data);

  return { ...result, ...(!result.success ? { values } : {}) };
}

export async function updateService(
  serviceId: string,
  formData: FormData
): Promise<TServiceFormState> {
  if (!/^[0-9a-fA-F]{24}$/.test(serviceId)) {
    return { success: false, message: "Invalid service ID." };
  }

  const { values, errors, data } = readServiceForm(formData);

  if (!data) return { success: false, message: "Please correct the highlighted fields.", errors, values };

  const result = await sendServiceRequest(`/services/${encodeURIComponent(serviceId)}`, "PATCH", data);

  return { ...result, ...(!result.success ? { values } : {}) };
}

export async function deleteService(serviceId: string): Promise<ActionResult> {
  if (!/^[0-9a-fA-F]{24}$/.test(serviceId)) {
    return { success: false, message: "Invalid service ID." };
  }

  return sendServiceRequest(`/services/${encodeURIComponent(serviceId)}`, "DELETE");
}

export async function updateServiceAvailability(
  serviceId: string,
  isAvailable: boolean
): Promise<ActionResult> {
  if (!/^[0-9a-fA-F]{24}$/.test(serviceId)) {
    return { success: false, message: "Invalid service ID." };
  }

  return sendServiceRequest(
    `/services/${encodeURIComponent(serviceId)}/availability`,
    "PATCH",
    { isAvailable }
  );
}
