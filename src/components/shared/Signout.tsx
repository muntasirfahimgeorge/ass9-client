
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export default function SignoutCompo() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await signOut();
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignout}
      disabled={isLoading}
      className="flex w-full items-center gap-2 text-left text-sm"
    >
      <LogOut size={16} />
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}
