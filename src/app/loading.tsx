import { LoaderCircle, Wrench } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#08090b] px-5 text-white">
      <div className="text-center">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c2f800] text-black">
          <Wrench size={30} />
          <LoaderCircle
            size={76}
            className="absolute animate-spin text-[#c2f800]"
          />
        </div>

        <h2 className="mt-7 text-xl font-semibold">Loading FixMate...</h2>
        <p className="mt-2 text-sm text-gray-400">
          Please wait while we prepare your page.
        </p>
      </div>
    </main>
  );
}