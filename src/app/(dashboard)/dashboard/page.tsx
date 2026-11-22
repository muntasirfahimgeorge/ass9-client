
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getDashboardPath,
  getSafeInternalRedirect,
} from "@/lib/auth/redirect";

export default async function DashboardPage() {
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

  redirect(dashboardPath);
}
