
import Link from "next/link";
import {
  CalendarCheck,
  ClipboardCheck,
  Cpu,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: CalendarCheck,
    title: "Book a repair easily",
    text: "Choose a service and schedule a convenient repair appointment.",
  },
  {
    icon: Wrench,
    title: "Trusted repair services",
    text: "Find technicians for your devices and home appliances.",
  },
  {
    icon: ClipboardCheck,
    title: "Track every request",
    text: "Monitor your bookings and stay updated on repair progress.",
  },
];

const LogoMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "grid size-11 shrink-0 place-items-center rounded-xl bg-[#B8F34A] text-[#14243A]",
      className
    )}
  >
    <Wrench className="size-6" strokeWidth={2.5} />
  </span>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#14243A] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[30rem] rounded-full bg-[#263D58] opacity-80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-24 size-[32rem] rounded-full bg-[#B8F34A]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <Link href="/" className="relative flex w-fit items-center gap-3">
          <LogoMark />
          <span className="text-xl font-bold tracking-tight">FixMate</span>
        </Link>

        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#B8F34A]/30 bg-[#B8F34A]/10 px-3 py-1.5 text-xs font-semibold text-[#B8F34A]">
            <Sparkles className="size-3.5" />
            SMART REPAIR SOLUTIONS
          </span>

          <div className="mt-8 flex size-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Cpu className="size-11 text-[#B8F34A]" strokeWidth={1.5} />
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
            Repair smarter.
            <br />
            <span className="text-[#B8F34A]">Live easier.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
            Your trusted platform for smart device and home appliance
            repair. Connect with skilled technicians and manage every
            repair request in one place.
          </p>

          <ul className="mt-10 space-y-6">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                  <Icon className="size-5 text-[#B8F34A]" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © FixMate. All rights reserved.
        </p>
      </aside>

      <main className="flex min-h-svh flex-col items-center justify-center bg-white px-5 py-10 sm:px-8">
        <Link
          href="/"
          className="mb-10 flex items-center gap-3 lg:hidden"
        >
          <LogoMark />
          <span className="text-xl font-bold tracking-tight text-[#14243A]">
            FixMate
          </span>
        </Link>

        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
