
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "./config";
import type { TUserRole } from "@/types";

export type TFixMateProfile = {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;
  image?: string | null;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  emailVerified?: boolean;
};

export async function getMyProfile(): Promise<TFixMateProfile> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    throw new Error("Please sign in to view your profile.");
  }

  const jwtToken = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!jwtToken?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.data) {
    throw new Error(
      body?.message || "Could not load your profile."
    );
  }

  return body.data as TFixMateProfile;
}
