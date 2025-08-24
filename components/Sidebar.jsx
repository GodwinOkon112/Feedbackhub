"use client";

import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import MobileNavbar from "@/components/MobileNavbar";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: HomeIcon },
  {
    label: "Suggestions",
    href: "/admin/suggestions",
    Icon: ChatBubbleLeftRightIcon,
  },

  { label: "Analytics", href: "/admin/analytics", Icon: ChartBarIcon },
  { label: "Settings", href: "/admin/settings", Icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/signout", { method: "POST" });
    router.push("/auth");
  };

  return (
    <>
      {/* ✅ Mobile Navbar */}
      <div className="md:hidden h-16">
        <MobileNavbar />
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden md:flex h-screen">
        <Sidebar className="border-r bg-white dark:bg-gray-950">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xl font-bold px-2 py-8  tracking-tight  text-gray-900 dark:text-gray-100">
                FeedBackHub
              </SidebarGroupLabel>
              <hr className="mb-6 border" />

              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(({ label, href, Icon }) => {
                    const isActive = pathname === href;

                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive
                                ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            <span>{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  );
}
