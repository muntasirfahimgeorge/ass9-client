"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("FixMate application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#08090b] px-5 text-white">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertTriangle size={32} />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Something Went Wrong</h1>

        <p className="mt-4 leading-7 text-gray-400">
          An unexpected error occurred. Please try again.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-gray-500">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c2f800] px-5 py-3 font-semibold text-black"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-lg border border-white/20 px-5 py-3 font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}