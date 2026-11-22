
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarDays,
  CreditCard,
  ChevronsUpDown,
  Wrench,
  House,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";

type TUserRole = "customer" | "technician" | "admin";

type TDashboardSidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

type TDashboardUser = {
  name: string;
  email: string;
  image?: string | null;
  role: string;
} | null;

const roleBasedSidebarItems: Record<TUserRole, TDashboardSidebarItem[]> = {
  customer: [
    {
      title: "Dashboard",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      title: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: CalendarDays,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/customer/bookings/upcoming",
      icon: CalendarCheck,
    },
    {
      title: "Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      title: "My Profile",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],
  technician: [
    {
      title: "Dashboard",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      title: "My Services",
      href: "/dashboard/technician/services",
      icon: Wrench,
    },
    {
      title: "Bookings",
      href: "/dashboard/technician/bookings",
      icon: CalendarDays,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/technician/bookings/upcoming",
      icon: CalendarCheck,
    },
    {
      title: "My Profile",
      href: "/dashboard/technician/profile",
      icon: UserRound,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Services",
      href: "/dashboard/admin/services",
      icon: Wrench,
    },
    {
      title: "Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Payments",
      href: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardSidebar({
  user,
}: {
  user: TDashboardUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const role: TUserRole =
    user?.role === "admin" || user?.role === "technician"
      ? user.role
      : "customer";

  const sidebarItems = roleBasedSidebarItems[role];

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          onClick={handleNavigation}
          className="flex items-center gap-3 px-2 py-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#B8F34A] text-[#14243A]">
            <Wrench size={21} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Fix<span className="text-[#B8F34A]">Mate</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.href}
                          onClick={handleNavigation}
                        />
                      }
                      isActive={active}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" onClick={handleNavigation} />}
              tooltip="Back to website"
            >
              <House />
              <span>Back to Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Sign out"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {user && (
          <div className="flex items-center gap-3 border-t p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#B8F34A] font-bold text-[#14243A]">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.role}
              </p>
            </div>
            <ChevronsUpDown className="size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
