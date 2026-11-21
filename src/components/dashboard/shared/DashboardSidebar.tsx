
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarDays,
  ChevronsUpDown,
  Droplets,
  House,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import type { TDashboardSidebarItem, TUser, TUserRole } from "@/types";

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
      icon: CalendarCheck,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/customer/bookings/upcoming",
      icon: CalendarDays,
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
      icon: Droplets,
    },
    {
      title: "Bookings",
      href: "/dashboard/technician/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/technician/bookings/upcoming",
      icon: CalendarDays,
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
      title: "Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Services",
      href: "/dashboard/admin/services",
      icon: Droplets,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
};

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const DashboardSidebar = ({ user }: { user: TUser | null }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const role = user?.role;
  const sidebarItems = role ? roleBasedSidebarItems[role] : [];

  const closeMobile = () => setOpenMobile(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="FixMate"
              render={
                <Link
                  href={role ? `/dashboard/${role}` : "/"}
                  onClick={closeMobile}
                />
              }
            >
              <div className="grid aspect-square size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Droplets />
              </div>

              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">FixMate</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Repair Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item: TDashboardSidebarItem) => {
                const { title, href, icon: Icon } = item;

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={isActivePath(pathname, href)}
                      render={<Link href={href} onClick={closeMobile} />}
                    >
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="rounded-lg after:rounded-lg">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                      className="rounded-lg"
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.name}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user.email}
                    </span>
                  </div>

                  <ChevronsUpDown className="ml-auto" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-56"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate capitalize">
                      Signed in as {user.role}
                    </DropdownMenuLabel>

                    <DropdownMenuItem
                      render={<Link href="/" onClick={closeMobile} />}
                    >
                      <House />
                      Back to site
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      render={
                        <Link
                          href={role ? `/dashboard/${role}/profile` : "/"}
                          onClick={closeMobile}
                        />
                      }
                    >
                      <UserRound />
                      My profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
