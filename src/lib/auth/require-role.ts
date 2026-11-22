
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getDashboardPath,
  getSafeInternalRedirect,
} from "@/lib/auth/redirect";
import type { TUserRole } from "@/types";

export async function requireRole(requiredRole: TUserRole) {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    const returnTo = getSafeInternalRedirect(
      requestHeaders.get("x-fixmate-return-to")
    );

    redirect(
      returnTo
        ? `/signin?callbackURL=${encodeURIComponent(returnTo)}`
        : "/signin"
    );
  }

  const dashboardPath = getDashboardPath(session.user.role);

  if (!dashboardPath) {
    redirect("/signin");
  }

  if (session.user.role !== requiredRole) {
    redirect(dashboardPath);
  }

  return session;
}
