
export function getDashboardPath(role: unknown): string | null {
  switch (role) {
    case "customer":
      return "/dashboard/customer";
    case "technician":
      return "/dashboard/technician";
    case "admin":
      return "/dashboard/admin";
    default:
      return null;
  }
}

export function getSafeInternalRedirect(
  value: string | null | undefined
): string | null {
  if (!value) return null;

  const candidate = value.trim();

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\u0000-\u001f]/.test(candidate)
  ) {
    return null;
  }

  try {
    const baseUrl = "http://fixmate.local";
    const parsedUrl = new URL(candidate, baseUrl);

    if (parsedUrl.origin !== baseUrl) return null;

    if (
      parsedUrl.pathname === "/signin" ||
      parsedUrl.pathname === "/signup" ||
      parsedUrl.pathname.startsWith("/api/")
    ) {
      return null;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return null;
  }
}
