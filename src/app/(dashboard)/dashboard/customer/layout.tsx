
import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/require-role";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("customer");

  return children;
}
