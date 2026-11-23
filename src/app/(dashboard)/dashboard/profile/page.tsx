import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/signin");
  }

  const role = session.user.role;

  if (role === "admin") {
    redirect("/dashboard/admin/profile");
  }

  if (role === "technician") {
    redirect("/dashboard/technician/profile");
  }

  redirect("/dashboard/customer/profile");
}
