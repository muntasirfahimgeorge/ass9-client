import Link from "next/link";
import { headers } from "next/headers";
import {
  Wrench,
  UserRound,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignoutCompo from "@/components/shared/Signout";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user?.role || "customer";
  const dashboardPath = `/dashboard/${role}`;
  const profilePath = `/dashboard/${role}/profile`;

  return (
    <header className="border-b border-slate-800 bg-[#14243A] text-white">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-white hover:bg-white/10 hover:text-[#B8F34A]" />

          <Link
            href="/"
            aria-label="FixMate homepage"
            className="group flex items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#B8F34A] text-[#14243A] transition-transform group-hover:rotate-[-8deg]">
              <Wrench size={23} strokeWidth={2.5} />
            </span>

            <span>
              <span className="block text-xl font-extrabold tracking-tight">
                Fix<span className="text-[#B8F34A]">Mate</span>
              </span>
              <span className="hidden text-[9px] font-medium tracking-[1.5px] text-slate-300 sm:block">
                SMART REPAIR. TRUSTED CARE.
              </span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden text-sm text-slate-300 md:inline">
            Your trusted repair partner
          </span>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open account menu"
                className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold transition-colors hover:border-[#B8F34A] hover:text-[#B8F34A]"
              >
                <UserRound size={17} />
                <span className="hidden max-w-32 truncate sm:inline">
                  {session.user.name || "My Account"}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuItem>
                  <Link
                    href={dashboardPath}
                    className="flex w-full items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href={profilePath}
                    className="flex w-full items-center gap-2"
                  >
                    <UserCircle size={16} />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <SignoutCompo />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold transition-colors hover:border-[#B8F34A] hover:text-[#B8F34A]"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="hidden rounded-lg bg-[#B8F34A] px-4 py-2 text-sm font-bold text-[#14243A] transition-colors hover:bg-[#a5df36] sm:inline-flex"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;