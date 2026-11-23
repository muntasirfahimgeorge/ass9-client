import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#08090b] px-5 text-white">
      <div className="max-w-lg text-center">
        <p className="text-7xl font-bold text-[#c2f800]">404</p>
        <h1 className="mt-5 text-3xl font-bold">Page Not Found</h1>
        <p className="mt-4 leading-7 text-gray-400">
          Sorry, the page you are looking for does not exist or may have been
          moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#c2f800] px-5 py-3 font-semibold text-black"
          >
            <Home size={18} />
            Back Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 font-semibold text-white"
          >
            <Search size={18} />
            Browse Services
          </Link>
        </div>
      </div>
    </main>
  );
}