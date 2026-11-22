
import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/require-role";

export default async function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("technician");

  return children;
}
